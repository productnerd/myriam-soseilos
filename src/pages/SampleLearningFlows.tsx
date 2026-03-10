import React from "react";
import { Separator } from "@/components/ui/layout/Separator";
import PageTransition from "@/components/ui/PageTransition";
import AdminAccessChecker from "@/components/admin/AdminAccessChecker";
import SampleInitialAssessmentFlow from "@/components/sample/SampleInitialAssessmentFlow";
import SampleTopicLearningFlow from "@/components/sample/SampleTopicLearningFlow";
import SampleLevelTestFlow from "@/components/sample/SampleLevelTestFlow";
import SampleReviewFlow from "@/components/sample/SampleReviewFlow";
import { sampleActivities } from "@/utils/sample/sampleActivities1";

const SampleLearningFlows: React.FC = () => {
	return (
		<PageTransition>
			<AdminAccessChecker>
				<div className="container mx-auto py-8 px-4">
					<h1 className="text-3xl font-bold mb-8">Sample Learning Flows</h1>
					<p className="text-muted-foreground mb-8">
						This page demonstrates our different learning flow UIs in isolation for
						testing purposes. Each section shows how a specific flow type looks and
						behaves.
					</p>

					{/* Initial Assessment */}
					<section>
						<SampleInitialAssessmentFlow activity={sampleActivities[0]} />
					</section>

					<Separator className="my-8" />

					{/* Topic Learning */}
					<section>
						<SampleTopicLearningFlow activity={sampleActivities[1]} />
					</section>

					<Separator className="my-8" />

					{/* Level Test */}
					<section>
						<SampleLevelTestFlow activity={sampleActivities[2]} />
					</section>

					<Separator className="my-8" />

					{/* Review */}
					<section>
						<SampleReviewFlow activity={sampleActivities[3]} />
					</section>
				</div>
			</AdminAccessChecker>
		</PageTransition>
	);
};

export default SampleLearningFlows;
