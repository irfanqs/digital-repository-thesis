package com.example.thesisrepo.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;

@Service
public class StorageService {

  @Value("${file.storage-root:${user.home}/Documents/ThesisRepo/uploads}")
  private String root;

  /**
   * Save a PDF to local storage under the provided objectKey (e.g., "2025-10/uuid.pdf")
   * Returns a file:// URI to the stored file.
   */
  public String savePdf(MultipartFile file, String objectKey) throws IOException {
    File base = new File(root);
    if (!base.exists() && !base.mkdirs()) {
      throw new IOException("Cannot create storage root: " + base.getAbsolutePath());
    }
    File dest = new File(base, objectKey);
    if (dest.getParentFile() != null && !dest.getParentFile().exists()) {
      if (!dest.getParentFile().mkdirs()) {
        throw new IOException("Cannot create dir: " + dest.getParentFile());
      }
    }
    file.transferTo(dest);
    return dest.toURI().toString(); // e.g., file:///.../2025-10/uuid.pdf
  }
}
