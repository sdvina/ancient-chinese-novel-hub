import lume from "lume/mod.ts";
import attributes from "lume/plugins/attributes.ts";
import date from "lume/plugins/date.ts";
import esbuild from "lume/plugins/esbuild.ts";
import filter_pages from "lume/plugins/filter_pages.ts";
import imagick from "lume/plugins/imagick.ts";
import inline from "lume/plugins/inline.ts";
import liquid from "lume/plugins/liquid.ts";
import metas from "lume/plugins/metas.ts";
import minify_html from "lume/plugins/minify_html.ts";
import modify_urls from "lume/plugins/modify_urls.ts";
import multilanguage from "lume/plugins/multilanguage.ts";
import pagefind from "lume/plugins/pagefind.ts";
import postcss from "lume/plugins/postcss.ts";
import relations from "lume/plugins/relations.ts";
import sass from "lume/plugins/sass.ts";
import sitemap from "lume/plugins/sitemap.ts";
import slugify_urls from "lume/plugins/slugify_urls.ts";
import source_maps from "lume/plugins/source_maps.ts";
import svgo from "lume/plugins/svgo.ts";
import toc from "https://deno.land/x/lume_markdown_plugins@v0.1.0/toc/mod.ts";

const markdown = {
    plugins: [toc],
    keepDefaultPlugins: true,
};

const site = lume({
    src: "./src",
    emptyDest: true
}, { markdown }); // dest default _site  location: new URL("https://example.com")

site.ignore(
    "./_fetcher",
    "./scripts",
    "./static"
);

site.copy(
    "./static"
);

site.use(attributes());
site.use(date());
site.use(esbuild({
    extensions: [".ts", ".js"],
    options: {
        plugins: [],
        bundle: true,
        format: "esm",
        minify: true,
        keepNames: true,
        platform: "browser",
        target: "esnext",
        treeShaking: true
    }
}));
site.use(filter_pages());
site.use(imagick());
site.use(inline());
site.use(liquid());
site.use(metas());
site.use(minify_html());
site.use(modify_urls());
site.use(multilanguage());
site.use(pagefind());
site.use(relations());
site.use(sass());
site.use(sitemap());
site.use(slugify_urls());
site.use(source_maps());
site.use(svgo());
site.use(postcss());

export default site;
