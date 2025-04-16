package tn.esprit.pidev.services;

import com.google.zxing.BarcodeFormat;
import com.google.zxing.WriterException;
import com.google.zxing.client.j2se.MatrixToImageConfig;
import com.google.zxing.client.j2se.MatrixToImageWriter;
import com.google.zxing.common.BitMatrix;
import com.google.zxing.qrcode.QRCodeWriter;

import javax.imageio.ImageIO;
import java.awt.image.BufferedImage;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.util.Base64;

public class QRCodeGenerator {
  public static String generateQRCodeImage(String text, int width, int height, int onColor, int offColor) throws WriterException, IOException {
    QRCodeWriter qrCodeWriter = new QRCodeWriter();
    BitMatrix bitMatrix = qrCodeWriter.encode(text, BarcodeFormat.QR_CODE, width, height);

    ByteArrayOutputStream pngOutputStream = new ByteArrayOutputStream();
    MatrixToImageConfig config = new MatrixToImageConfig(onColor, offColor);
    BufferedImage bufferedImage = MatrixToImageWriter.toBufferedImage(bitMatrix, config);

    ImageIO.write(bufferedImage, "PNG", pngOutputStream);
    return Base64.getEncoder().encodeToString(pngOutputStream.toByteArray());
  }
}
