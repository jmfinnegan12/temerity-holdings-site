import { pathToRoot } from "../util/path"
import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types"
import { classNames } from "../util/lang"
import { i18n } from "../i18n"

const PageTitle: QuartzComponent = ({ fileData, cfg, displayClass }: QuartzComponentProps) => {
  const title = cfg?.pageTitle ?? i18n(cfg.locale).propertyDefaults.title
  const baseDir = pathToRoot(fileData.slug!)
  return (
    <h2 class={classNames(displayClass, "page-title")}>
      <a href={baseDir} class="page-title-link">
        <svg class="page-title-logo" viewBox="0 0 26 22" aria-hidden="true" focusable="false">
          <g fill="currentColor">
            <rect width="26" height="4"></rect>
            <rect width="4" height="22"></rect>
            <rect x="11" width="4" height="22"></rect>
            <rect x="22" width="4" height="22"></rect>
            <rect x="4" y="9" width="7" height="4"></rect>
            <rect x="15" y="9" width="7" height="4"></rect>
          </g>
        </svg>
        <span>{title}</span>
      </a>
    </h2>
  )
}

PageTitle.css = `
.page-title {
  font-size: 1.75rem;
  margin: 0;
  font-family: var(--titleFont);
}
.page-title-link {
  display: inline-flex;
  align-items: center;
  gap: 0.55rem;
}
.page-title-logo {
  height: 1.5rem;
  width: auto;
  flex: none;
}
`

export default (() => PageTitle) satisfies QuartzComponentConstructor
