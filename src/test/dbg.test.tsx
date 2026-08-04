import { describe, it } from "vitest";
import { render } from "@testing-library/react";
import { HelmetProvider } from "react-helmet-async";
import CourseSchema from "@/components/CourseSchema";
describe("dbg", () => {
  it("dump", async () => {
    render(<HelmetProvider><CourseSchema /></HelmetProvider>);
    await new Promise(r => setTimeout(r, 50));
    console.log("HEAD:", document.head.innerHTML.slice(0, 400));
  });
});
