import { useState } from "react";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/data/Table";
import { Button } from "@/components/ui/interactive/Button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/overlay/Dialog";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form/Form";
import { Input } from "@/components/ui/form/Input";
import { Textarea } from "@/components/ui/form/Textarea";
import { useMessageTemplates } from "@/hooks/admin/useMessageTemplates";
import { useForm } from "react-hook-form";
import { Pencil } from "lucide-react";

export const MessageTemplatesTab = () => {
	const { templates, isLoading, updateTemplate } = useMessageTemplates();
	const [selectedTemplate, setSelectedTemplate] = useState<any>(null);
	const form = useForm();

	if (isLoading) {
		return (
			<div className="p-8 text-center text-muted-foreground">
				Loading message templates...
			</div>
		);
	}

	const handleEdit = (template: any) => {
		setSelectedTemplate(template);
		form.reset(template);
	};

	const onSubmit = async (data: any) => {
		await updateTemplate.mutateAsync({
			id: selectedTemplate.id,
			...data,
		});
		setSelectedTemplate(null);
	};

	return (
		<div className="space-y-6">
			<div className="flex items-center justify-between">
				<h2 className="text-2xl font-bold">Automated Message Templates</h2>
			</div>

			<Table>
				<TableHeader>
					<TableRow>
						<TableHead>Title</TableHead>
						<TableHead>Tag</TableHead>
						<TableHead>Description</TableHead>
						<TableHead>Actions</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{templates?.map((template) => (
						<TableRow key={template.id}>
							<TableCell>{template.title}</TableCell>
							<TableCell>
								<span className="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800">
									{template.tag}
								</span>
							</TableCell>
							<TableCell className="max-w-[400px] whitespace-pre-wrap break-words">
								{template.description}
							</TableCell>
							<TableCell>
								<Button
									variant="ghost"
									size="sm"
									onClick={() => handleEdit(template)}
								>
									<Pencil className="h-4 w-4" />
								</Button>
							</TableCell>
						</TableRow>
					))}
				</TableBody>
			</Table>

			<Dialog open={!!selectedTemplate} onOpenChange={() => setSelectedTemplate(null)}>
				<DialogContent className="max-w-2xl">
					<DialogHeader>
						<DialogTitle>Edit Message Template</DialogTitle>
					</DialogHeader>
					<Form {...form}>
						<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
							<FormField
								control={form.control}
								name="title"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Title</FormLabel>
										<FormControl>
											<Input {...field} />
										</FormControl>
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name="tag"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Tag</FormLabel>
										<FormControl>
											<Input {...field} />
										</FormControl>
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name="description"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Description</FormLabel>
										<FormControl>
											<Textarea {...field} rows={2} />
										</FormControl>
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name="payload"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Message Content</FormLabel>
										<FormControl>
											<Textarea {...field} rows={10} />
										</FormControl>
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name="image_url"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Image URL (optional)</FormLabel>
										<FormControl>
											<Input {...field} />
										</FormControl>
									</FormItem>
								)}
							/>
							<div className="flex justify-end space-x-2">
								<Button
									type="button"
									variant="outline"
									onClick={() => setSelectedTemplate(null)}
								>
									Cancel
								</Button>
								<Button type="submit">Save Changes</Button>
							</div>
						</form>
					</Form>
				</DialogContent>
			</Dialog>
		</div>
	);
};
