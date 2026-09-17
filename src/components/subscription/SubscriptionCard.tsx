import "./SubscriptionCard.scss";

interface Props {
  title: string;
  price: string;
  duration: string;
}

const SubscriptionCard = ({
  title,
  price,
  duration,
}: Props) => {
  return (
    <div className="subscription-card">

      <h3>{title}</h3>

      <h1>{price}</h1>

      <p>{duration}</p>

      <ul>
        <li>Unlimited Courses</li>
        <li>Video Lessons</li>
        <li>Practice Materials</li>
        <li>Certificates</li>
      </ul>

      <button>Subscribe</button>

    </div>
  );
};

export default SubscriptionCard;