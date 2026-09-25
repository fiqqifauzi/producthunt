# Shopee Affiliate Product Hunter

Prototype dashboard interaktif untuk menemukan produk Shopee Affiliate yang layak dipromosikan. Proyek ini mensimulasikan alur product discovery: menyaring katalog, membandingkan peluang, menyimpan produk ke watchlist, melihat penilaian detail, dan membuat ide konten affiliate.

## Preview

Buka `index.html` langsung di browser modern. Tidak perlu menjalankan server, memasang package, atau melakukan build.

## Fitur

- Pencarian berdasarkan nama produk, toko, atau kategori.
- Filter kategori, rentang harga, minimum penjualan, rating, dan komisi.
- Tab untuk Top Opportunities, Trending, Latest, serta Highest Commission.
- Katalog produk dummy bergaya pasar Indonesia dengan pagination.
- Opportunity Score dengan breakdown Demand, Commission, Rating, Price, Content Potential, dan Competition.
- Detail drawer pada desktop dan overlay responsif pada layar kecil.
- Watchlist yang disimpan di `localStorage` browser.
- Generator lima angle konten: Problem–Solution, Before/After, Satisfying Demo, Product Discovery, dan Comparison.
- Placeholder yang jelas untuk fitur roadmap seperti Niche Hunter, Winning Products, AI Content, dan Performance.

## Cara menjalankan

1. Clone repository ini.
2. Buka `index.html` dengan browser modern, misalnya Chrome, Edge, Safari, atau Firefox.

```bash
git clone https://github.com/fiqqifauzi/producthunt.git
open producthunt/index.html
```

## Catatan desain

Tampilan desktop dirancang sebagai tool riset yang padat: sidebar navy, pencarian di atas, filter satu baris, KPI, tabel peluang, dan panel detail produk di kanan. Seluruh CSS, JavaScript, data demo, serta aset visual ringan berada di dalam satu file agar prototype dapat dibagikan dan dibuka offline.

## Batasan prototype

- Data, harga, komisi, performa, dan tautan Shopee adalah data demonstrasi.
- Tombol **Open in Shopee** belum mengarah ke marketplace nyata.
- Integrasi data aktual, autentikasi, dan API affiliate berada di luar cakupan prototype ini.
