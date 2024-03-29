import type { APIRoute } from "astro";

export const prerender = false;

export const GET: APIRoute = ({ preferredLocale, redirect, cookies }) => {
    return redirect("/test");
};