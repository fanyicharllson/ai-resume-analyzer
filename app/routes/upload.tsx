import React, {useState} from 'react'
import NavBar from "~/components/NavBar";
import FileUploader from "~/components/FileUploader";
import {usePuterStore} from "~/lib/puter";
import {useNavigate} from "react-router";
import {convertPdfToImage} from "~/lib/PDF2Img";
import {generateUUID} from "~/lib/format";
import {prepareInstructions} from "../../constants";

const Upload = () => {
    const {auth, isLoading, fs, ai, kv } = usePuterStore();
    const navigate = useNavigate();
    const [isProcessing, setIsProcessing] = useState(false)
    const [statusText, setStatusText] = useState('');
    const [file, setFile] = useState<File | null>(null);

    interface AnalyzeProps {
        companyName: string;
        jobTitle: string;
        jobDescription: string;
        file: File;
    }

    const handleFileSelect = (file: File | null) => {
        setFile(file);
    }

    const handleAnalize = async ({companyName, jobTitle, jobDescription, file}: AnalyzeProps) => {
        setIsProcessing(true);
        setStatusText("Uploading file...");
        const uploadedFile = await fs.upload([file])
        if(!uploadedFile) return setStatusText("Error: Failed to upload your resume!");

        setStatusText("Converting to image...");
        const imageFile = await convertPdfToImage(file);
        if(!imageFile) return setStatusText("Error: Failed to convert PDF to image!");

        setStatusText("Uploading the image...");
        if (!imageFile.file) return setStatusText("Error: Failed to create image file!");
        const uploadedImage = await fs.upload([imageFile.file]);
        if(!uploadedImage) return setStatusText("Error: Failed to upload your resume!");

        setStatusText("Preparing data...");
        const uuid = generateUUID();
        const data = {
            id: uuid,
            resumePath: uploadedFile.path,
            imagePath: uploadedImage.path,
            companyName, jobTitle, jobDescription,
            feedback: '',
        }

        await  kv.set(`resume:${uuid}`, JSON.stringify(data));

        setStatusText("Analyzing...")
        const feedBack = await ai.feedback(
            uploadedFile.path,
            prepareInstructions({jobTitle, jobDescription})
        )

        if(!feedBack) return setStatusText("Error: Failed to analyze your resume!");

        const feedbackText = typeof  feedBack.message.content === 'string' ? feedBack.message.content : feedBack.message.content[0].text;

        data.feedback = JSON.parse(feedbackText);
        await kv.set(`resume:${uuid}`, JSON.stringify(data));
        setStatusText("Analysis complete, redirecting...");
        console.log(data)

        navigate(`/resume/${uuid}`);
    }

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const form = e.currentTarget.closest('form');
        if(!form) return;
        const formData = new FormData(form);

        const companyName = formData.get('company-name') as string;
        const jobTitle = formData.get('job-title') as string;
        const jobDescription = formData.get('job-description') as string;

        handleAnalize({companyName, jobTitle, jobDescription, file} as AnalyzeProps);


    }
    return (
        <main className="bg-[url('/images/bg-main.svg')] bg-cover">
            <NavBar/>
            <section className="main-section">
                <div className="page-heading py-16">
                    <h1>Smart feedback for your dream job</h1>
                    {isProcessing ? (
                        <>
                            <h2>{statusText}</h2>
                            <img src="/images/resume-scan.gif" alt="resume-scan" className="w-full"/>
                        </>
                    ) : (
                        <>
                            <h2>Drop your resume for an ATS score and improvement tips</h2>
                        </>
                    )}
                    {
                        !isProcessing && (
                            <form id="upload-form" onSubmit={handleSubmit} className="flex flex-col gap-4 pt-8">
                                <div className="form-div">
                                    <label htmlFor="company-name">Company Name</label>
                                    <input type="text" name="company-name" id="company-name" placeholder="Company Name"
                                           required/>

                                </div>
                                <div className="form-div">
                                    <label htmlFor="job-title">Job Title</label>
                                    <input type="text" name="job-title" id="job-title" placeholder="Job Title" required/>

                                </div>
                                <div className="form-div">
                                    <label htmlFor="job-description">Job Description</label>
                                    <textarea rows={5} name="job-description" id="job-description"
                                              placeholder="Job Description"
                                              required/>

                                </div>
                                <div className="form-div">
                                    <label htmlFor="uploader">Upload Resume</label>
                                    <FileUploader onFileSelect={handleFileSelect}/>
                                </div>

                                <button className={"primary-button"} type="submit">
                                    Analyze Resume
                                </button>
                            </form>
                        )}
                </div>
            </section>
        </main>
    )
}
export default Upload
