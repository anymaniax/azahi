# Azahi Docs

This is source code to azahi.com. It is forked from the [Formik](https://formik.org) docs and is built with:

- Next.js
- MDX
- Tailwind
- Algolia
- Notion

## Running locally

```sh
yarn install
```

With tokens and page index in hand, rename `.sample.env` and `.sample.env.build` to just `.env` and `.env.build`. In each one, add respective parameters:

```
NEXT_PUBLIC_ALGOLIA_APP_ID=<YOUR APP ID>
NEXT_PUBLIC_ALGOLIA_API_KEY=<YOUR API KEY>
NEXT_PUBLIC_ALGOLIA_INDEX_NAME=<YOUR INDEX NAME>
```

Now it will work. Run `yarn dev` to get going.

If you get stuck or need help, [send a DM to Jared](https://twitter.com/jaredpalmer) on Twitter.
