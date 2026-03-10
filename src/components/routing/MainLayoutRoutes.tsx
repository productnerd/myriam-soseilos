import { Route } from "react-router-dom";
import HomePage from "@/pages/HomePage";
import InboxPage from "@/pages/InboxPage";
import QuestsPage from "@/pages/QuestsPage";
import LearnPage from "@/pages/LearnPage";
import ProfilePage from "@/pages/ProfilePage";
import InitialTestPage from "@/pages/InitialTestPage";
import LevelTestPage from "@/pages/LevelTestPage";
import TopicLearningPage from "@/pages/TopicLearningPage";
import ContributorActivitiesPage from "@/pages/ContributorActivitiesPage";
import ContributorsPage from "@/pages/ContributorsPage";
import SampleLearningFlows from "@/pages/SampleLearningFlows";
import SampleActivitiesPage from "@/pages/SampleActivitiesPage";
import SampleCompletionScreens from "@/pages/SampleCompletionScreens";
import StorePage from "@/pages/StorePage";
import TestPage from "@/pages/TestPage";
import CoursesPage from "@/pages/CoursesPage";
import SundayPage from "@/pages/SundayPage";
import ReviewTestPage from "@/pages/ReviewTestPage";

export const MainLayoutRoutes = (
	<>
		{/* The HomePage is the default page that is rendered when the user navigates to the root URL (i.e. "/" */}
		<Route index element={<HomePage />} />
		<Route path="/inbox" element={<InboxPage />} />
		<Route path="/quests" element={<QuestsPage />} />
		<Route path="/learn" element={<LearnPage />} />
		<Route path="/store" element={<StorePage />} />
		<Route path="/profile" element={<ProfilePage />} />
		<Route
			path="/initial-test/:testId/:courseId"
			element={<InitialTestPage />}
		/>
		<Route path="/level-test/:testId/:levelId" element={<LevelTestPage />} />
		<Route path="/learn/:topicId" element={<TopicLearningPage />} />
		{/* <Route path="/topic/:courseId/:levelId/:topicId" element={<TopicLearningPage />} /> */}
		<Route path="/contributor" element={<ContributorsPage />} />
		<Route
			path="/contributor/activities"
			element={<ContributorActivitiesPage />}
		/>
		<Route path="/sample-learning-flows" element={<SampleLearningFlows />} />
		<Route path="/sample-activities" element={<SampleActivitiesPage />} />
		<Route
			path="/sample-completion-screens"
			element={<SampleCompletionScreens />}
		/>
		<Route path="/test" element={<TestPage />} />
		<Route path="/courses" element={<CoursesPage />} />
		<Route path="/sunday" element={<SundayPage />} />
		<Route path="/review-test" element={<ReviewTestPage />} />
	</>
);
