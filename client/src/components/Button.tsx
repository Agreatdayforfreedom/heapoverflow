interface Props {
  name: string;
  disabled?: boolean;
}

const Button = ({ name, disabled }: Props) => {
  return (
    <button
      type="submit"
      className="button primary whitespace-nowrap"
      disabled={disabled}
    >
      {name}
    </button>
  );
};

export default Button;
