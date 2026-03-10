import React, { useState } from "react";
import { ActivityRating } from "@/types/activity";
import { Button } from "@/components/ui/interactive/Button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/layout/Card";
import { X, Edit, Save, ThumbsUp, ThumbsDown } from "lucide-react";
import { Textarea } from "@/components/ui/form/Textarea";
import { Input } from "@/components/ui/form/Input";
import { Form, FormField, FormItem, FormLabel, FormControl } from "@/components/ui/form/Form";
import { useForm } from "react-hook-form";
import { useActivityEdit } from "@/hooks/admin/useActivityEdit";
import { Badge } from "@/components/ui/data/Badge";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/form/Select";
import { useUpdateCommunityNote } from "@/hooks/admin/useUpdateCommunityNote";

interface CommunityNoteDetailProps {
	note: ActivityRating;
	onClose: () => void;
}

const CommunityNoteDetail: React.FC<CommunityNoteDetailProps> = ({ note, onClose }) => {
	const [isEditingActivity, setIsEditingActivity] = useState(false);
	const [isEditingNote, setIsEditingNote] = useState(false);
	const { updateActivity, isUpdating } = useActivityEdit();
	const { mutate: updateNote } = useUpdateCommunityNote();

	const activityForm = useForm({
		defaultValues: {
			main_text: note.activity?.main_text || "",
			correct_answer: note.activity?.correct_answer || "",
			explanation: note.activity?.explanation || "",
		},
	});

	const noteForm = useForm({
		defaultValues: {
			comment: note.comment || "",
			status: note.status || "Open",
		},
	});

	const handleEditActivity = () => {
		setIsEditingActivity(true);
	};

	const handleEditNote = () => {
		setIsEditingNote(true);
	};

	const handleSaveActivity = async (values: any) => {
		if (!note.activity?.id) return;

		await updateActivity(note.activity.id, values);
		setIsEditingActivity(false);
	};

	const handleSaveNote = async (values: any) => {
		await updateNote({
			noteId: note.id,
			status: values.status,
			comment: values.comment,
		});
		setIsEditingNote(false);
	};

	const handleCancelActivity = () => {
		activityForm.reset();
		setIsEditingActivity(false);
	};

	const handleCancelNote = () => {
		noteForm.reset();
		setIsEditingNote(false);
	};

	const handleStatusChange = (status: string) => {
		console.log(`Changing status from detail view: ${note.id} to ${status}`);
		updateNote(
			{
				noteId: note.id,
				status,
			},
			{
				onSuccess: () => {
					console.log("Status updated successfully in detail view");
				},
				onError: (error) => {
					console.error("Error updating status in detail view:", error);
				},
			}
		);
	};

	return (
		<Card className="w-full">
			<CardHeader className="flex flex-row items-center justify-between">
				<CardTitle>Community Note Details</CardTitle>
				<Button variant="ghost" size="icon" onClick={onClose}>
					<X size={20} />
				</Button>
			</CardHeader>

			<CardContent className="space-y-6">
				<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
					<div className="space-y-3">
						<h3 className="text-lg font-medium">User Information</h3>
						<div className="space-y-2">
							<div className="flex items-center gap-2">
								<span className="font-semibold">Name:</span>
								<span>{note.user?.name || "Unknown user"}</span>
								{note.user?.flag && <span>{note.user.flag}</span>}
							</div>
							<div>
								<span className="font-semibold">Email:</span>{" "}
								<span>{note.user?.email || "Unknown"}</span>
							</div>
							<div className="flex gap-2">
								<span className="font-semibold">Tags:</span>
								<div className="flex flex-wrap gap-1">
									{note.user?.tags && note.user.tags.length > 0 ? (
										note.user.tags.map((tag) => (
											<Badge key={tag} variant="outline">
												{tag}
											</Badge>
										))
									) : (
										<span className="text-muted-foreground italic">
											No tags
										</span>
									)}
								</div>
							</div>
							<div className="flex items-center gap-2">
								<span className="font-semibold">Rating:</span>
								{note.is_positive ? (
									<div className="flex items-center">
										<ThumbsUp className="text-green-500 mr-1" size={16} />
										<span>Positive</span>
									</div>
								) : (
									<div className="flex items-center">
										<ThumbsDown className="text-red-500 mr-1" size={16} />
										<span>Negative</span>
									</div>
								)}
							</div>

							<div className="flex flex-col gap-2">
								<div className="flex justify-between items-center">
									<span className="font-semibold">Comment:</span>
									{!isEditingNote && (
										<Button
											variant="outline"
											size="sm"
											onClick={handleEditNote}
										>
											<Edit size={16} className="mr-1" />
											Edit Note
										</Button>
									)}
								</div>

								{isEditingNote ? (
									<Form {...noteForm}>
										<form
											onSubmit={noteForm.handleSubmit(handleSaveNote)}
											className="space-y-4"
										>
											<FormField
												control={noteForm.control}
												name="comment"
												render={({ field }) => (
													<FormItem>
														<FormControl>
															<Textarea
																{...field}
																className="min-h-[100px]"
															/>
														</FormControl>
													</FormItem>
												)}
											/>

											<FormField
												control={noteForm.control}
												name="status"
												render={({ field }) => (
													<FormItem>
														<FormLabel>Status</FormLabel>
														<FormControl>
															<Select
																value={field.value}
																onValueChange={field.onChange}
															>
																<SelectTrigger className="w-[180px]">
																	<SelectValue placeholder="Select status" />
																</SelectTrigger>
																<SelectContent>
																	<SelectItem value="Open">
																		Open
																	</SelectItem>
																	<SelectItem value="Addressed">
																		Addressed
																	</SelectItem>
																	<SelectItem value="Rejected">
																		Rejected
																	</SelectItem>
																	<SelectItem value="Published">
																		Published
																	</SelectItem>
																</SelectContent>
															</Select>
														</FormControl>
													</FormItem>
												)}
											/>

											<div className="flex gap-2 justify-end">
												<Button
													variant="outline"
													type="button"
													onClick={handleCancelNote}
												>
													Cancel
												</Button>
												<Button variant="default" type="submit">
													<Save size={16} className="mr-1" />
													Save Note
												</Button>
											</div>
										</form>
									</Form>
								) : (
									<div className="p-3 bg-muted rounded-md mt-1 whitespace-pre-wrap break-words">
										{note.comment || (
											<span className="text-muted-foreground italic">
												No comment provided
											</span>
										)}
									</div>
								)}
							</div>

							<div>
								<span className="font-semibold">Status:</span>{" "}
								{!isEditingNote && (
									<Select value={note.status} onValueChange={handleStatusChange}>
										<SelectTrigger className="w-[180px] inline-flex ml-2">
											<SelectValue placeholder="Select status" />
										</SelectTrigger>
										<SelectContent>
											<SelectItem value="Open">Open</SelectItem>
											<SelectItem value="Addressed">Addressed</SelectItem>
											<SelectItem value="Rejected">Rejected</SelectItem>
											<SelectItem value="Published">Published</SelectItem>
										</SelectContent>
									</Select>
								)}
							</div>

							<div>
								<span className="font-semibold">Submitted:</span>{" "}
								<span>{note.formattedDate}</span>
							</div>
						</div>
					</div>

					<div className="space-y-3">
						<div className="flex items-center justify-between">
							<h3 className="text-lg font-medium">Activity Information</h3>
							{!isEditingActivity ? (
								<Button variant="outline" size="sm" onClick={handleEditActivity}>
									<Edit size={16} className="mr-1" />
									Edit Activity
								</Button>
							) : (
								<div className="flex gap-2">
									<Button
										variant="outline"
										size="sm"
										onClick={handleCancelActivity}
									>
										Cancel
									</Button>
									<Button
										variant="default"
										size="sm"
										onClick={activityForm.handleSubmit(handleSaveActivity)}
										disabled={isUpdating}
									>
										<Save size={16} className="mr-1" />
										Save
									</Button>
								</div>
							)}
						</div>

						{isEditingActivity ? (
							<Form {...activityForm}>
								<form
									onSubmit={activityForm.handleSubmit(handleSaveActivity)}
									className="space-y-4"
								>
									<FormField
										control={activityForm.control}
										name="main_text"
										render={({ field }) => (
											<FormItem>
												<FormLabel>Question Text</FormLabel>
												<FormControl>
													<Textarea
														{...field}
														className="min-h-[100px]"
													/>
												</FormControl>
											</FormItem>
										)}
									/>

									<FormField
										control={activityForm.control}
										name="correct_answer"
										render={({ field }) => (
											<FormItem>
												<FormLabel>Correct Answer</FormLabel>
												<FormControl>
													<Input {...field} />
												</FormControl>
											</FormItem>
										)}
									/>

									<FormField
										control={activityForm.control}
										name="explanation"
										render={({ field }) => (
											<FormItem>
												<FormLabel>Explanation</FormLabel>
												<FormControl>
													<Textarea
														{...field}
														className="min-h-[100px]"
													/>
												</FormControl>
											</FormItem>
										)}
									/>
								</form>
							</Form>
						) : (
							<div className="space-y-3">
								<div>
									<span className="font-semibold">Course:</span>{" "}
									<span>
										{note.activity?.topic?.level?.course?.title || "Unknown"}
									</span>
								</div>
								<div>
									<span className="font-semibold">Level:</span>{" "}
									<span>{note.activity?.topic?.level?.title || "Unknown"}</span>
								</div>
								<div>
									<span className="font-semibold">Topic:</span>{" "}
									<span>{note.activity?.topic?.title || "Unknown"}</span>
								</div>
								<div>
									<span className="font-semibold">Question:</span>
									<div className="p-3 bg-muted rounded-md mt-1">
										{note.activity?.main_text || "Unknown"}
									</div>
								</div>
								<div>
									<span className="font-semibold">Answer:</span>{" "}
									<span>{note.activity?.correct_answer || "Unknown"}</span>
								</div>
								<div>
									<span className="font-semibold">Explanation:</span>
									<div className="p-3 bg-muted rounded-md mt-1">
										{note.activity?.explanation || "None provided"}
									</div>
								</div>
							</div>
						)}
					</div>
				</div>
			</CardContent>
		</Card>
	);
};

export default CommunityNoteDetail;
