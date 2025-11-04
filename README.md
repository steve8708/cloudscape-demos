## Cloudscape Design System Demos

This package contains demo pages that follow [Cloudscape Design System](https://cloudscape.design) guidelines and use [Cloudscape components](https://cloudscape.design/components).

Cloudscape is an open source design system for building intuitive, engaging, and inclusive user experiences at scale. It consists of an extensive set of guidelines to create web applications, along with the design resources and front-end components to streamline implementation.

Cloudscape was built for and is used by Amazon Web Services (AWS) products and services. We created it in 2016 to improve the user experience across AWS web applications, and also to help teams implement those applications faster. Since then, we have continued enhancing the system based on customer feedback and research.

You can view the demos running live from the the [Cloudscape website 'demos' list](https://cloudscape.design/demos/).

### Build the project

To install the project dependencies and build all demos:

```
npm install
npm run build
```

The demo artifacts will be output to the `/dist` folder.

### Run Dev Server (with Vite)

To start a dev server with live reload and filesystem routing:

```
npm run dev
```

The demos will be available at http://localhost:5173 (or the port Vite chooses).

- Each file in `src/pages/` automatically becomes a route (e.g., `src/pages/cards/index.tsx` → `/cards`).
- Add new pages to `src/pages/` to create new routes instantly.

### Preview Production Build

To preview the production build locally:

```
npm run preview
```

### Run Tests

```
npm test
```

This will run the test suite.

## Security

See [CONTRIBUTING](CONTRIBUTING.md#security-issue-notifications) for more information.

## License

This library is licensed under the MIT-0 License. See the LICENSE file.
