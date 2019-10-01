const del = require(`del`);
const gulp = require(`gulp`);
const sass = require(`gulp-sass`);
const plumber = require(`gulp-plumber`);
const postcss = require(`gulp-postcss`);
const autoprefixer = require(`autoprefixer`);
const server = require(`browser-sync`).create();
const mqpacker = require(`css-mqpacker`);
const minify = require(`gulp-csso`);
const rename = require(`gulp-rename`);
const imagemin = require(`gulp-imagemin`);
const svgstore = require(`gulp-svgstore`);
const tinypng = require(`gulp-tinypng-compress`);
const svgmin = require(`gulp-svgmin`);
const rollup = require(`gulp-better-rollup`);
const sourcemaps = require(`gulp-sourcemaps`);

gulp.task(`style`, () => {
  return gulp.src(`src/sass/style.scss`, {
    allowEmpty: true
  }).
  pipe(plumber()).
  pipe(sass()).
  pipe(postcss([
    autoprefixer({}),
    mqpacker({
      sort: true
    })
  ])).
  pipe(gulp.dest(`build/css`)).
  pipe(server.stream()).
  pipe(minify()).
  pipe(rename(`style.min.css`)).
  pipe(gulp.dest(`build/css`));
});

gulp.task(`sprite`, function () {
  return gulp.src(`./build/**/*.svg`)
    .pipe(svgmin({
      plugins: [{
        removeViewBox: false
      }]
    }))
    .pipe(svgstore({
      inlineSvg: true
    }))
    .pipe(rename(`sprite.svg`))
    .pipe(gulp.dest(`./build`));
});

gulp.task(`scripts`, () => {
  return gulp.src(`src/js/**/*.js`, {
    allowEmpty: true
  })
    .pipe(plumber())
    .pipe(sourcemaps.init())
    .pipe(rollup({}, `iife`))
    .pipe(sourcemaps.write(``))
    .pipe(gulp.dest(`build/js`));
});


gulp.task(`copy`, gulp.series(`scripts`, `style`, () => {
  return gulp.src([
    `src/**/*.{html,ico}`,
    `src/**/*.{woff,woff2}`,
    `src/**/*.{jpg,svg,png,jpeg,gif}`
  ], {

  }).
  pipe(gulp.dest(`build`));
}));

gulp.task(`tinypng`, gulp.series(() => {
  return gulp.src(`./build/img/**/*.{png,jpg,jpeg}`)
    .pipe(tinypng({
      key: `RsCZev1geyFwOKznstLNGmxugsTZZmG6`,
      sigFile: `./img/.tinypng-sigs`,
      log: true
    }))
    .pipe(gulp.dest(`./build/img`));
}));


gulp.task(`imagemin`, gulp.series(() => {
  return gulp.src(`build/img/**/*.{jpg,png,jpeg,gif}`).
  pipe(imagemin([
    imagemin.optipng({
      optimizationLevel: 3
    }),
    imagemin.jpegtran({
      progressive: true
    })
  ])).
  pipe(gulp.dest(`build/img`));
}));


gulp.task(`clean`, () => {
  return del(`build`);
});

gulp.task(`reload`, (done) => {
  server.reload();
  done();
});

gulp.task(`js-watch`, gulp.series(`scripts`, (done) => {
  server.reload();
  done();
}));

gulp.task(`assemble`, gulp.series(`clean`, `copy`));

// imagemin/tinypng img compression

gulp.task(`build`, gulp.series(`assemble`, `imagemin`, `sprite`));

gulp.task(`serve`, gulp.series(`build`, () => {
  server.init({
    server: `./build`,
    notify: false,
    open: true,
    port: 3502,
    ui: false
  });

  gulp.watch(`src/sass/**/*.{scss,sass}`, gulp.series(`style`, `reload`));
  gulp.watch(`src/*.html`, gulp.series(`copy`, `reload`));
  gulp.watch(`src/js/**/*.js`, gulp.series(`js-watch`));
}));
