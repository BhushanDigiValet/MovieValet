import QRCode from "qrcode";

async function generateQRCode(text) {
  try {
    // Generate QR code as a data URL (e.g., "data:image/png;base64,...")
    const dataUrl = await QRCode.toDataURL(text);
    return dataUrl;
  } catch (error) {
    console.error("Error generating QR code:", error);
    throw new Error("QR code generation failed");
  }
}
