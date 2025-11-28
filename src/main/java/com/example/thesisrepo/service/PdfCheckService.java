package com.example.thesisrepo.service;

import org.springframework.stereotype.Service;

import java.io.File;

@Service
public class PdfCheckService {

    /**
     * Legacy stub method – always returns false and does not read the file.
     */
    public boolean containsText(File pdf, String needle) {
        return false;
    }
}
