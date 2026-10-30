export async function reserveQuota(
  reserve: () => PromiseLike<{ data: unknown; error: unknown }>,
): Promise<boolean> {
  try {
    const { data, error } = await reserve();
    return !error && data === true;
  } catch {
    return false;
  }
}