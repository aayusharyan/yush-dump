# Yush Dump

A dependency-free image archive, based on the fixed-sidebar composition of the supplied **Sylk / home-sidebar-variant-2** template.

## Add your photographs

1. Put web-ready images in `assets/photos/`.
2. Add one object per image to `photos.js`.
3. Replace the placeholder `alt` text with a short description of the real photograph.

```js
{ 
  src: "assets/photos/my-photo.jpg",
  title: "A useful title",
  year: "2026",
  alt: "A short description for screen readers",
  width: 1600,
  height: 1200
}
```

The width and height values should match the source file. They prevent the gallery from jumping while images load.

## Preview locally

From the repository directory, run any static file server. For example:

```sh
python3 -m http.server 4173
```

Then open `http://localhost:4173`.

## Deploy

The site is plain HTML, CSS, and JavaScript, so it can be served directly by GitHub Pages or any static host. For GitHub Pages, choose the `main` branch and `/ (root)` in **Settings → Pages**.

## Starter assets

The included gradient placeholders come from the theme package supplied for this build. Replace them with your own images before launch.
