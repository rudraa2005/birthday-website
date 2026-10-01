# Birthday website

This is a zero-build static website. Deploy the **`public`** folder as the site’s publish directory.

## Project structure

```text
public/
  index.html       page shell and font loading
  styles.css       visual design and responsive layout
  app.js           gate, music, scrolling, envelope, and gallery interactions
  content.js       every editable word, caption, date, path, and playlist name
  photos/          add the image files listed below
  audio/           add the music files listed below
```

## Add your photos and music

Place your files in the two folders below with these exact names:

```text
public/photos/landing-page.JPG
public/photos/trait-1.JPG, trait-2.JPG, trait-3.JPG, trait-4.PNG, trait-5.JPG, trait-6.JPG
public/photos/gallery-1.jpg through gallery-10.jpg
public/audio/playlist-1.mp3
public/audio/playlist-2.mp3
public/audio/playlist-3.mp3
```

You can add or remove playlist entries in `public/content.js`. Use the same file path in the playlist entry. Images are lazy-loaded; broken or absent image files show a tasteful placeholder instead of a broken-image icon.

## Change the words

Open `public/content.js`. It contains all visible copy: section labels, dates, timeline entries, traits, apology, letter, gallery captions, and music titles. Replace the clearly marked placeholder sentences with your own words.

## Run it locally

From the project folder, run one of these commands:

```bash
npx serve public
```

or, if you have Python installed:

```bash
python3 -m http.server 8000 --directory public
```

Then visit the local address printed in the terminal. A server is recommended because browsers can handle audio more consistently than when opening the HTML file directly.

## Deploy

### Netlify

Create a new site and publish the `public` directory, or drag the `public` folder into Netlify Drop.

### Vercel

Import the repository, set the framework preset to **Other**, and set the output directory to `public`. No build command is required.

## Optional date gate

In `public/content.js`, change `site.optionalGate.enabled` to `true`, then set `answer` to a private date with no spaces or punctuation, for example `11122024`. This is a sweet client-side gate only; it is not a security feature because the answer is still included in the downloaded site files.
