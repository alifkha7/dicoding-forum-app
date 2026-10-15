# Bukti Screenshot Pengujian CI/CD & Branch Protection

Folder ini digunakan untuk menyimpan 3 berkas tangkapan layar wajib sesuai ketentuan Submission Proyek Akhir Dicoding:

1. `1_ci_check_error.png`
   - Bukti screenshot di GitHub Actions / Pull Request saat pengecekan CI mengalami kegagalan (status merah / red cross).
   - Cara menghasilkan: Buat commit sengaja melanggar linting atau tes pada branch terpisah, lalu buka Pull Request ke `main`.

2. `2_ci_check_pass.png`
   - Bukti screenshot di GitHub Actions / Pull Request saat pengecekan CI berhasil lulus (status hijau / green checkmark).
   - Cara menghasilkan: Perbaiki commit tersebut dan push kembali ke branch PR hingga status CI hijau.

3. `3_branch_protection.png`
   - Bukti screenshot halaman pengaturan repositori GitHub di menu **Settings -> Branches -> Branch protection rules** untuk branch `main`.
   - Pastikan opsi **Require status checks to pass before merging** (menargetkan job CI `build-and-test`) terlihat aktif tercentang.
