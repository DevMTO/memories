import sys
from PyPDF2 import PdfReader

with open("pdf_output.txt", "w", encoding="utf-8") as f:
    reader = PdfReader(sys.argv[1])
    for page in reader.pages:
        f.write(page.extract_text() + "\n")
