# SCSS

This architecture is based on [inuticss](https://github.com/inuitcss/inuitcss) framework.

## CSS directory structure

- `/settings` - global variables (colors, font sizes, etc.)
- `/tools` - mixins and functions
- `/generic` - low-specificity (e.g. resets)
- `/elements` - HTML elements with no classes (a, p, ul, ol, blockquote, address, etc.)
- `/objects` - objects, abstractions, and design patterns
- `/components` - discrete, complete chunks of UI
- `/utilities` - high-specificity, very explicit selectors, overrides and helper classes

## Naming convention

When creating new file please use the following naming convention:

`_` + `folder` + `.` + `file` + `.scss`

For example, let's create a file where we will write variables for the colors:

Create SCSS file with filename `_settings.colors.scss` which belongs in the `/settings` folder: `/settings/_settings.colors.scss`.

This way it's easier to inspect elements and classes.

## Settings & Tools

Settings should not affect CSS itself, it's only used for the variables. Don't write classes and styles in this folder.

Default files in the settings folder:

- [config](settings/_settings.config.scss) - debug, etc.
- [colors](settings/_settings.colors.scss) - file where you should write all global colors that you are using throughout the project
- [breakpoints](settings/_settings.breakpoints.scss) - media query breakpoints, here you can add your own or replace the existing one
- [fonts](settings/_settings.fonts.scss) - list of font weights; here we use only two font names (primary and titles), you can also add your own
- [font-size](settings/_settings.font-size.scss) - set font size, line height and default unit for the font sizes; this is also the file where you will write your whole typographic scale for the project

### Config ([view file](settings/_settings.config.scss))

Default config file:

```scss
$settings-config: (
  debug: false
);
```

Using variable by calling the function `getConfig()` and passing key as an argument:

```scss
html {
  @if getConfig("debug") {
    background-color: red;
  }
}
```

### Colors ([view file](settings/_settings.colors.scss))

Default file for color naming:

```scss
$settings-colors: (
  "default": (
    "white": #ffffff,
    "black": #000000
  ),
  "html": (
    "text": #000000,
    "background": #ffffff
  ),
  "primary": (
    "white": #ffffff,
    "black": #000000
  ),
  "variations": (
    "black-0": rgba(#000000, 0),
    "black-10": rgba(#000000, 0.1),
    "black-20": rgba(#000000, 0.2),
    "black-30": rgba(#000000, 0.3),
    "black-40": rgba(#000000, 0.4),
    "black-50": rgba(#000000, 0.5),
    "black-60": rgba(#000000, 0.6),
    "black-70": rgba(#000000, 0.7),
    "black-80": rgba(#000000, 0.8),
    "black-90": rgba(#000000, 0.9),
    "black-100": rgba(#000000, 1)
  ),
  "form": (
    "error-red": #fa0000,
    "success-green": #6dd348
  )
);
```

Using the color:

```scss
.c-btn {
  color: getColor("black-two");
}
```

By default function `getColor()` takes two arguments:

1. color name inside sub-map `'white'`, `'black'`, etc.
2. map name (default: `'primary'`): `'html'`, `'primary'`, `'variations'`, `'form'`

### Breakpoint(s)/media query ([view file](settings/_settings.breakpoints.scss))

List of all breakpoints, feel free to add your own:

```scss
$settings-breakpoints: (
  "sm": 480px,
  "md": 800px,
  "lg": 1140px,
  "xl": 1400px,
  "xxl": 2000px
);
```

Using `max-width`:

```scss
.max-width-option {
  color: red;

  @include mq(lg) {
    color: blue;
  }
}
```

Using `min-width`:

```scss
.min-width-option {
  color: red;

  @include mq($from: md) {
    color: blue;
  }
}
```

Using range from `min-width` to `max-width`:

```scss
.range-option {
  color: red;

  @include mq(md, lg) {
    color: blue;
  }
}
```

Adding orientation:

```scss
.orientation-option {
  color: red;

  @include mq(md, $and: "orientation: landscape") {
    color: blue;
  }
}
```
