export default function StarRating({
  rating,
  size = 16,
  color = "#C9A227",
}: {
  rating: number;
  size?: number;
  color?: string;
}) {
  return (
    <div className="flex items-center gap-0.5" aria-label={`${rating} / 5 yıldız`}>
      {[1, 2, 3, 4, 5].map((i) => (
        <svg
          key={i}
          width={size}
          height={size}
          viewBox="0 0 24 24"
          fill={i <= Math.round(rating) ? color : "none"}
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
            stroke={color}
            strokeWidth="1.2"
            strokeLinejoin="round"
          />
        </svg>
      ))}
    </div>
  );
}
