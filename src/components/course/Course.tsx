import "./CourseCard.scss";

interface CourseCardProps {
  title: string;
  level: string;
  instructor: string;
  image: string;
}

const CourseCard = ({
  title,
  level,
  instructor,
  image,
}: CourseCardProps) => {
  return (
    <div className="course-card">
      <img src={image} alt={title} />

      <div className="course-content">
        <span>{level}</span>

        <h3>{title}</h3>

        <p>{instructor}</p>

        <button>View Course</button>
      </div>
    </div>
  );
};

export default CourseCard;