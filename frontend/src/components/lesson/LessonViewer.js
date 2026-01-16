// components/lesson/LessonViewer.jsx
import "./LessonViewer.css";
import LessonHero from "./LessonHero";
import LessonIntroduction from "./LessonIntroduction";
import LessonMainPoints from "./LessonMainPoints";
import LessonExamples from "./LessonExamples";
import LessonMCQs from "./LessonMCQs";
import LessonResources from "./LessonResources";
import LessonSummary from "./LessonSummary";
import LessonNavigation from "./LessonNavigation";
import LessonYouTubeSection from "./LessonYouTube";


const LessonViewer = ({ lesson, youtubeVideos, onNext }) => {
  if (!lesson) return null;

  return (
    <div className="lesson-container">
      <LessonNavigation />

      <LessonHero
        title={lesson.title}
        description={lesson.description}
      />

      <LessonIntroduction introduction={lesson.introduction} />

      <LessonMainPoints points={lesson.mainPoints} />

      <LessonExamples examples={lesson.examples} />

      <LessonYouTubeSection videos={youtubeVideos} />


      <LessonMCQs mcqs={lesson.mcqs} />

      <LessonResources resources={lesson.suggestedResources} />

      <LessonSummary summary={lesson.summary} />

      <div className="lesson-complete-section">
        <button className="lesson-btn-complete" onClick={onNext}>
          Mark Complete & Get Next
        </button>
      </div>
    </div>
  );
};

export default LessonViewer;
