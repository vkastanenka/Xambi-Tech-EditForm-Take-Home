interface CardProps {
  children: React.ReactElement
}

export const Card: React.FC<CardProps> = ({ children }) => {
  return <div className="p-4 rounded-md border-[1px] bg-white">{children}</div>
}
