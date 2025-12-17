import { Component, JSX, Show, splitProps } from 'solid-js';

type Variant = 'primary' | 'secondary' | 'outline' | 'ghost';
type Size = 'sm' | 'md' | 'lg';

interface ButtonProps extends JSX.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  loading?: boolean;
  children: JSX.Element;
}

export const Button: Component<ButtonProps> = (props) => {
  const [local, others] = splitProps(props, ['variant', 'size', 'loading', 'children', 'disabled', 'class']);

  const variant = () => local.variant ?? 'primary';
  const size = () => local.size ?? 'md';
  const isDisabled = () => local.disabled || local.loading;

  const classes = () => `btn ${variant()} ${size()} ${local.class ?? ''}`.trim();

  return (
    <button class={classes()} disabled={isDisabled()} {...others}>
      <Show when={local.loading} fallback={local.children}>
        <span class="spinner" />
      </Show>
    </button>
  );
};

// CSS (add to your stylesheet)
const styles = `
.btn { display: inline-flex; align-items: center; justify-content: center; gap: 0.5rem; border-radius: 0.5rem; font-weight: 600; cursor: pointer; border: none; transition: all 0.2s; }
.btn:disabled { opacity: 0.5; cursor: not-allowed; }
.primary { background: #3b82f6; color: white; }
.secondary { background: #64748b; color: white; }
.outline { background: transparent; border: 1px solid #3b82f6; color: #3b82f6; }
.ghost { background: transparent; color: #3b82f6; }
.sm { padding: 0.5rem 0.75rem; font-size: 0.875rem; }
.md { padding: 0.75rem 1rem; font-size: 1rem; }
.lg { padding: 1rem 1.5rem; font-size: 1.125rem; }
.spinner { width: 1rem; height: 1rem; border: 2px solid transparent; border-top-color: currentColor; border-radius: 50%; animation: spin 0.6s linear infinite; }
@keyframes spin { to { transform: rotate(360deg); } }
`;
