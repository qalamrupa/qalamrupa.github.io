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

## Gaya
- Bahasa situs: Indonesia.
- Warna: latar `#F6F1E7`, tinta `#1B2A3A`, aksen `#A4502F` (lihat `src/styles/global.css`).
- Font: Fraunces (judul), DM Sans (teks).

## Perintah
- `npm run dev` — server lokal
- `npm run build` — cek build sebelum push
