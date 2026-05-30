import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types"
import { classNames } from "../util/lang"

type Options = {
  // beehiiv magic-link base, e.g. https://magic.beehiiv.com/v1/<id>
  // The email input is appended as ?email=<value> on submit.
  action: string
  title?: string
  description?: string
}

export default ((opts: Options) => {
  const Subscribe: QuartzComponent = ({ displayClass }: QuartzComponentProps) => {
    return (
      <div class={classNames(displayClass, "subscribe")}>
        {opts.title && <h3 class="subscribe-title">{opts.title}</h3>}
        {opts.description && <p class="subscribe-desc">{opts.description}</p>}
        <form class="subscribe-form" action={opts.action} method="get" target="_blank">
          <input
            class="subscribe-input"
            type="email"
            name="email"
            placeholder="you@email.com"
            aria-label="Email address"
            required
          />
          <button class="subscribe-btn" type="submit">
            Subscribe
          </button>
        </form>
      </div>
    )
  }

  Subscribe.css = `
.subscribe {
  margin-top: 2rem;
  padding-top: 1.5rem;
  border-top: 1px solid var(--lightgray);
}
.subscribe-title {
  margin: 0 0 0.3rem;
}
.subscribe-desc {
  margin: 0 0 0.9rem;
  color: var(--gray);
}
.subscribe-form {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
  max-width: 480px;
}
.subscribe-input {
  flex: 1;
  min-width: 200px;
  padding: 0.55rem 0.75rem;
  border: 1px solid var(--lightgray);
  border-radius: 5px;
  background: var(--light);
  color: var(--dark);
  font-size: 1rem;
}
.subscribe-input::placeholder {
  color: var(--gray);
}
.subscribe-input:focus {
  outline: none;
  border-color: #6f63ac;
}
:root[saved-theme="dark"] .subscribe-input:focus {
  border-color: #c7bce0;
}
.subscribe-btn {
  padding: 0.55rem 1.2rem;
  border: 1px solid #6f63ac;
  border-radius: 5px;
  background: #6f63ac;
  color: #fff;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
}
:root[saved-theme="dark"] .subscribe-btn {
  background: #c7bce0;
  border-color: #c7bce0;
  color: #1e1e24;
}
.subscribe-btn:hover {
  filter: brightness(1.08);
}
`

  return Subscribe
}) satisfies QuartzComponentConstructor<Options>
