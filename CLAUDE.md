# Website Qalam Rupa — Aturan Main

Repo `qalamrupa/qalamrupa.github.io` → https://qalamrupa.github.io (Astro, deploy otomatis via GitHub Actions saat push ke `main`).

## Repo ini PUBLIK
- JANGAN menulis sandi, API key, token, isi `.env`, atau kredensial apa pun.
- JANGAN menaruh data pribadi: nama lengkap, alamat, nomor HP, email pribadi, foto wajah, nomor KTP/rekening.
- Jangan pernah `git push --force`. Jangan menghapus `.gitignore`.

## Sumber konten
- Semua konten berasal dari vault (`D:\qalam-rupa\vault`, repo private `qalamrupa/vault`).
- Hanya file vault berlabel `publik: ya` yang boleh disalin ke sini (perintah "Publish: <judul>").
- Jangan menulis konten baru langsung di sini tanpa sumber di vault.
- Yang boleh tampil (termasuk dari AI Lab `qalamrupa/ai-lab`): tulisan Catetan Diajar, ringkasan cek keamanan,
  hasil kreatif, lencana Pakakas (nama, kategori, tanggal — dari `vault\pakakas\`, hanya `publik: ya`).
- Lencana Pakakas disalin ke `src/data/pakakas/<tool>.md` (file sama persis dari vault, hanya yang `publik: ya`);
  ditampilkan oleh `src/components/Pakakas.astro` di halaman Karya dengan judul publik **"Checklist tools"**
  (lencana berjajar, hanya nama tool — tanpa tanggal, sub judul, atau judul kategori). Istilah internal tetap "pakakas". Tool baru di vault → salin juga ke sini.
- Tidak pernah tampil: log mentah, error, path PC, sandbox, antrian ide, proyek kantor/klien, XP/streak.

## Gaya
- Bahasa situs: Indonesia.
- Warna: latar `#F6F1E7`, tinta `#1B2A3A`, aksen `#A4502F` (lihat `src/styles/global.css`).
- Font: Fraunces (judul), DM Sans (teks).

## Perintah
- `npm run dev` — server lokal
- `npm run build` — cek build sebelum push
