interface StatCardProps {
  label: string;
  value: string | number;
  prefix?: string;
}

const StatCard = ({ label, value, prefix }: StatCardProps) => {
  return (
    <div className="bg-card rounded-lg p-4 shadow-card">
      <p className="text-sm text-muted-foreground mb-1">{label}</p>
      <p className="text-2xl font-bold text-foreground">
        {prefix}
        {value}
      </p>
    </div>
  );
};

export default StatCard;