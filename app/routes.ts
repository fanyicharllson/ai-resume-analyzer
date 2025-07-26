import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
    index("routes/home.tsx"),
    route('/auth', "routes/auth.tsx"),
    route("/upload", 'routes/upload.tsx'),
    route("/resume/:id", 'routes/resume.tsx'),
    // Add a catch-all route to handle paths like "/.well-known/appspecific/com.chrome.devtools.json"
    route('*', "routes/catch-all.tsx"),
] satisfies RouteConfig;
