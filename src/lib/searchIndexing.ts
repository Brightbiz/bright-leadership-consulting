/** Only the public custom domain may index discovery pages. */
export function shouldNoindex(hostname: string, pageNoindex: boolean) {
  return pageNoindex || !["brightleadershipconsulting.com", "www.brightleadershipconsulting.com"].includes(hostname);
}