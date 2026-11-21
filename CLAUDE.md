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
- Bookmark: frontmatter `vault\bookmark\<nama>.md` yang `publik: ya` disalin ke `src/data/bookmark/<nama>.md`
  (HANYA frontmatter — catatan pribadi di bawahnya tidak pernah disalin), tampil di `/bookmark/` (`src/pages/bookmark.astro`).
  Kolom: judul, link, kategori, alesan (±6 kata), pilihan (ya/henteu), tanggal, publik. Tanpa label harga.
- Catatan Harian (`/catatan-harian/`): artikel dari berita Warta Rupa yang ditandai Fajar, ditulis ulang dengan suara mofajar.
  File = salinan persis `vault\konten\<tanggal>-<slug>.md` berlabel `publik: ya` → `src/data/catatan/<tanggal>-<slug>.md`
  (URL = nama file tanpa tanggal). Gambar di `public/catatan-harian/<slug>/` (cover 1200×630). Halaman: `src/pages/catatan-harian/`.
  Kolom: judul, jenis, publik, tanggal, jam (opsional, "HH:MM", urutan kalau tanggal sama), tag, kategori, ringkasan, cover, cover_alt, cover_kredit. Ikuti `vault\brand\gaya-tulisan.md`.
  Gambar karya orang lain wajib kredit + link kreator; gambar buatan AI diberi keterangan "dibuat dengan bantuan AI".
- Tidak pernah tampil: log mentah, error, path PC, sandbox, antrian ide, proyek kantor/klien, XP/streak.

## Gaya
- Bahasa situs: Indonesia.
- Warna: latar `#F6F1E7`, tinta `#1B2A3A`, aksen `#A4502F` (lihat `src/styles/global.css`).
- Font: Fraunces (judul), DM Sans (teks).

## Perintah
- `npm run dev` — server lokal
- `npm run build` — cek build sebelum push
