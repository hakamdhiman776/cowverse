type CowHeaderProps = {
  dimmed: boolean;
};

export function CowHeader({ dimmed }: CowHeaderProps) {
  return (
    <header className={`cow-header${dimmed ? ' is-dimmed' : ''}`}>
      <h1 className="cow-header-title">
        TAP ANYWHERE AND SEE THE MAGIC{' '}
        <span className="cow-header-sparkle" aria-hidden="true">
          ✨
        </span>
      </h1>
    </header>
  );
}
