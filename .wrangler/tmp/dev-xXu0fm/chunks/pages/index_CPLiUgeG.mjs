globalThis.process ??= {}; globalThis.process.env ??= {};
const prerender = false;
const GET = ({ preferredLocale, redirect, cookies }) => {
  return redirect("/test");
};

export { GET, prerender };
