export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type Database = {
	public: {
		Tables: {
			access_codes: {
				Row: {
					code: string;
					created_at: string;
					created_by: string | null;
					description: string | null;
					id: string;
					is_active: boolean;
					users_joined_counter: number;
				};
				Insert: {
					code: string;
					created_at?: string;
					created_by?: string | null;
					description?: string | null;
					id?: string;
					is_active?: boolean;
					users_joined_counter?: number;
				};
				Update: {
					code?: string;
					created_at?: string;
					created_by?: string | null;
					description?: string | null;
					id?: string;
					is_active?: boolean;
					users_joined_counter?: number;
				};
				Relationships: [];
			};
			activities: {
				Row: {
					author_id: string | null;
					correct_answer: Json;
					correct_answer_count: number | null;
					created_at: string;
					difficulty: string | null; // TODO: What is the purpose of this field?
					embed_url: string | null;
					explanation: Json;
					id: string;
					main_text: string;
					options: Json | null;
					order_number: number;
					statistics: Json | null;
					test_id: string | null;
					topic_id: string | null;
					type: string;
					updated_at: string;
				};
				Insert: {
					author_id?: string | null;
					correct_answer: Json;
					correct_answer_count?: number | null;
					created_at?: string;
					difficulty?: string | null;
					embed_url?: string | null;
					explanation: Json;
					id?: string;
					main_text: string;
					options?: Json | null;
					order_number: number;
					statistics?: Json | null;
					test_id?: string | null;
					topic_id?: string | null;
					type: string;
					updated_at?: string;
				};
				Update: {
					author_id?: string | null;
					correct_answer?: Json;
					correct_answer_count?: number | null;
					created_at?: string;
					difficulty?: string | null;
					embed_url?: string | null;
					explanation?: Json;
					id?: string;
					main_text?: string;
					options?: Json | null;
					order_number?: number;
					statistics?: Json | null;
					test_id?: string | null;
					topic_id?: string | null;
					type?: string;
					updated_at?: string;
				};
				Relationships: [
					{
						foreignKeyName: "activities_author_id_fkey";
						columns: ["author_id"];
						isOneToOne: false;
						referencedRelation: "profiles";
						referencedColumns: ["id"];
					},
					{
						foreignKeyName: "activities_topic_id_fkey";
						columns: ["topic_id"];
						isOneToOne: false;
						referencedRelation: "topics";
						referencedColumns: ["id"];
					},
					{
						foreignKeyName: "fk_activities_test_id";
						columns: ["test_id"];
						isOneToOne: false;
						referencedRelation: "tests";
						referencedColumns: ["id"];
					}
				];
			};
			activity_submission_counts: {
				Row: {
					submission_count: number;
					submission_date: string;
					user_id: string;
				};
				Insert: {
					submission_count?: number;
					submission_date?: string;
					user_id: string;
				};
				Update: {
					submission_count?: number;
					submission_date?: string;
					user_id?: string;
				};
				Relationships: [];
			};
			admin_audit_logs: {
				Row: {
					action_type: string;
					admin_id: string;
					created_at: string | null;
					details: string | null;
					entity_id: string | null;
					entity_type: string;
					id: string;
					ip_address: string | null;
					new_state: Json | null;
					previous_state: Json | null;
				};
				Insert: {
					action_type: string;
					admin_id: string;
					created_at?: string | null;
					details?: string | null;
					entity_id?: string | null;
					entity_type: string;
					id?: string;
					ip_address?: string | null;
					new_state?: Json | null;
					previous_state?: Json | null;
				};
				Update: {
					action_type?: string;
					admin_id?: string;
					created_at?: string | null;
					details?: string | null;
					entity_id?: string | null;
					entity_type?: string;
					id?: string;
					ip_address?: string | null;
					new_state?: Json | null;
					previous_state?: Json | null;
				};
				Relationships: [
					{
						foreignKeyName: "admin_audit_logs_admin_id_fkey";
						columns: ["admin_id"];
						isOneToOne: false;
						referencedRelation: "profiles";
						referencedColumns: ["id"];
					}
				];
			};
			cards: {
				Row: {
					class: string;
					created_at: string | null;
					hp: number;
					id: string;
					image_url: string;
					name: string;
					type: string;
					updated_at: string | null;
				};
				Insert: {
					class: string;
					created_at?: string | null;
					hp: number;
					id?: string;
					image_url: string;
					name: string;
					type: string;
					updated_at?: string | null;
				};
				Update: {
					class?: string;
					created_at?: string | null;
					hp?: number;
					id?: string;
					image_url?: string;
					name?: string;
					type?: string;
					updated_at?: string | null;
				};
				Relationships: [];
			};
			collaborators: {
				Row: {
					bio: string | null;
					created_at: string;
					id: string;
					name: string;
					social_links: Json | null;
					thumbnail: string | null;
					updated_at: string;
					website: string | null;
				};
				Insert: {
					bio?: string | null;
					created_at?: string;
					id?: string;
					name: string;
					social_links?: Json | null;
					thumbnail?: string | null;
					updated_at?: string;
					website?: string | null;
				};
				Update: {
					bio?: string | null;
					created_at?: string;
					id?: string;
					name?: string;
					social_links?: Json | null;
					thumbnail?: string | null;
					updated_at?: string;
					website?: string | null;
				};
				Relationships: [];
			};
			community_notes: {
				Row: {
					activity_id: string;
					comment: string | null;
					created_at: string | null;
					id: string;
					is_positive: boolean;
					status: string;
					user_id: string;
				};
				Insert: {
					activity_id: string;
					comment?: string | null;
					created_at?: string | null;
					id?: string;
					is_positive: boolean;
					status?: string;
					user_id: string;
				};
				Update: {
					activity_id?: string;
					comment?: string | null;
					created_at?: string | null;
					id?: string;
					is_positive?: boolean;
					status?: string;
					user_id?: string;
				};
				Relationships: [
					{
						foreignKeyName: "activity_ratings_activity_id_fkey";
						columns: ["activity_id"];
						isOneToOne: false;
						referencedRelation: "activities";
						referencedColumns: ["id"];
					}
				];
			};
			contributor_applications: {
				Row: {
					activities_rated_count: number | null;
					admin_notes: string | null;
					created_at: string | null;
					days_as_user: number | null;
					feedback: string | null;
					grey_points: number | null;
					id: string;
					is_accredited_expert: boolean | null;
					public_links: string | null;
					reviewed_at: string | null;
					reviewed_by: string | null;
					status: Database["public"]["Enums"]["contributor_application_status"] | null;
					updated_at: string | null;
					user_id: string;
				};
				Insert: {
					activities_rated_count?: number | null;
					admin_notes?: string | null;
					created_at?: string | null;
					days_as_user?: number | null;
					feedback?: string | null;
					grey_points?: number | null;
					id?: string;
					is_accredited_expert?: boolean | null;
					public_links?: string | null;
					reviewed_at?: string | null;
					reviewed_by?: string | null;
					status?: Database["public"]["Enums"]["contributor_application_status"] | null;
					updated_at?: string | null;
					user_id: string;
				};
				Update: {
					activities_rated_count?: number | null;
					admin_notes?: string | null;
					created_at?: string | null;
					days_as_user?: number | null;
					feedback?: string | null;
					grey_points?: number | null;
					id?: string;
					is_accredited_expert?: boolean | null;
					public_links?: string | null;
					reviewed_at?: string | null;
					reviewed_by?: string | null;
					status?: Database["public"]["Enums"]["contributor_application_status"] | null;
					updated_at?: string | null;
					user_id?: string;
				};
				Relationships: [];
			};
			course_sources: {
				Row: {
					course_id: string;
					created_at: string;
					id: string;
					source_id: string;
				};
				Insert: {
					course_id: string;
					created_at?: string;
					id?: string;
					source_id: string;
				};
				Update: {
					course_id?: string;
					created_at?: string;
					id?: string;
					source_id?: string;
				};
				Relationships: [
					{
						foreignKeyName: "course_sources_course_id_fkey";
						columns: ["course_id"];
						isOneToOne: false;
						referencedRelation: "courses";
						referencedColumns: ["id"];
					},
					{
						foreignKeyName: "course_sources_source_id_fkey";
						columns: ["source_id"];
						isOneToOne: false;
						referencedRelation: "sources";
						referencedColumns: ["id"];
					}
				];
			};
			courses: {
				Row: {
					color: string;
					created_at: string;
					description: string;
					icon: string | null;
					id: string;
					image: string;
					skill_tags: string[] | null;
					status: string | null;
					title: string;
					updated_at: string;
				};
				Insert: {
					color: string;
					created_at?: string;
					description: string;
					icon?: string | null;
					id?: string;
					image: string;
					skill_tags?: string[] | null;
					status?: string | null;
					title: string;
					updated_at?: string;
				};
				Update: {
					color?: string;
					created_at?: string;
					description?: string;
					icon?: string | null;
					id?: string;
					image?: string;
					skill_tags?: string[] | null;
					status?: string | null;
					title?: string;
					updated_at?: string;
				};
				Relationships: [];
			};
			friend_requests: {
				Row: {
					created_at: string;
					id: string;
					receiver_id: string;
					sender_id: string;
					status: string;
					updated_at: string;
				};
				Insert: {
					created_at?: string;
					id?: string;
					receiver_id: string;
					sender_id: string;
					status?: string;
					updated_at?: string;
				};
				Update: {
					created_at?: string;
					id?: string;
					receiver_id?: string;
					sender_id?: string;
					status?: string;
					updated_at?: string;
				};
				Relationships: [];
			};
			friends: {
				Row: {
					created_at: string;
					friend_id: string;
					id: string;
					user_id: string;
				};
				Insert: {
					created_at?: string;
					friend_id: string;
					id?: string;
					user_id: string;
				};
				Update: {
					created_at?: string;
					friend_id?: string;
					id?: string;
					user_id?: string;
				};
				Relationships: [];
			};
			levels: {
				Row: {
					course_id: string;
					created_at: string;
					id: string;
					order_number: number;
					title: string;
					updated_at: string;
				};
				Insert: {
					course_id: string;
					created_at?: string;
					id?: string;
					order_number: number;
					title: string;
					updated_at?: string;
				};
				Update: {
					course_id?: string;
					created_at?: string;
					id?: string;
					order_number?: number;
					title?: string;
					updated_at?: string;
				};
				Relationships: [
					{
						foreignKeyName: "levels_course_id_fkey";
						columns: ["course_id"];
						isOneToOne: false;
						referencedRelation: "courses";
						referencedColumns: ["id"];
					}
				];
			};
			message_templates: {
				Row: {
					created_at: string;
					description: string | null;
					id: string;
					image_url: string | null;
					payload: string;
					tag: string;
					title: string;
					updated_at: string;
				};
				Insert: {
					created_at?: string;
					description?: string | null;
					id?: string;
					image_url?: string | null;
					payload: string;
					tag: string;
					title: string;
					updated_at?: string;
				};
				Update: {
					created_at?: string;
					description?: string | null;
					id?: string;
					image_url?: string | null;
					payload?: string;
					tag?: string;
					title?: string;
					updated_at?: string;
				};
				Relationships: [];
			};
			modify_activity_submissions: {
				Row: {
					activity_id: string;
					admin_comment: string | null;
					created_at: string;
					id: string;
					modified_data: Json;
					original_data: Json;
					reviewed_at: string | null;
					reviewed_by: string | null;
					status: string;
					updated_at: string;
					user_id: string;
				};
				Insert: {
					activity_id: string;
					admin_comment?: string | null;
					created_at?: string;
					id?: string;
					modified_data: Json;
					original_data: Json;
					reviewed_at?: string | null;
					reviewed_by?: string | null;
					status?: string;
					updated_at?: string;
					user_id: string;
				};
				Update: {
					activity_id?: string;
					admin_comment?: string | null;
					created_at?: string;
					id?: string;
					modified_data?: Json;
					original_data?: Json;
					reviewed_at?: string | null;
					reviewed_by?: string | null;
					status?: string;
					updated_at?: string;
					user_id?: string;
				};
				Relationships: [
					{
						foreignKeyName: "modify_activity_submissions_activity_id_fkey";
						columns: ["activity_id"];
						isOneToOne: false;
						referencedRelation: "activities";
						referencedColumns: ["id"];
					}
				];
			};
			new_activity_submissions: {
				Row: {
					admin_comment: string | null;
					correct_answer: string;
					course_id: string;
					created_at: string;
					explanation: string | null;
					id: string;
					main_text: string;
					options: Json | null;
					reviewed_at: string | null;
					reviewed_by: string | null;
					source_link: string | null;
					status: string;
					topic_id: string;
					type: string;
					updated_at: string;
					user_id: string;
				};
				Insert: {
					admin_comment?: string | null;
					correct_answer: string;
					course_id: string;
					created_at?: string;
					explanation?: string | null;
					id?: string;
					main_text: string;
					options?: Json | null;
					reviewed_at?: string | null;
					reviewed_by?: string | null;
					source_link?: string | null;
					status?: string;
					topic_id: string;
					type: string;
					updated_at?: string;
					user_id: string;
				};
				Update: {
					admin_comment?: string | null;
					correct_answer?: string;
					course_id?: string;
					created_at?: string;
					explanation?: string | null;
					id?: string;
					main_text?: string;
					options?: Json | null;
					reviewed_at?: string | null;
					reviewed_by?: string | null;
					source_link?: string | null;
					status?: string;
					topic_id?: string;
					type?: string;
					updated_at?: string;
					user_id?: string;
				};
				Relationships: [
					{
						foreignKeyName: "new_activity_submissions_course_id_fkey";
						columns: ["course_id"];
						isOneToOne: false;
						referencedRelation: "courses";
						referencedColumns: ["id"];
					},
					{
						foreignKeyName: "new_activity_submissions_topic_id_fkey";
						columns: ["topic_id"];
						isOneToOne: false;
						referencedRelation: "topics";
						referencedColumns: ["id"];
					}
				];
			};
			onboarding_activities: {
				Row: {
					correct_answer: string;
					created_at: string;
					explanation: string;
					id: string;
					main_text: string;
					options: Json | null;
					order_number: number;
					type: string;
					updated_at: string;
				};
				Insert: {
					correct_answer: string;
					created_at?: string;
					explanation: string;
					id?: string;
					main_text: string;
					options?: Json | null;
					order_number: number;
					type: string;
					updated_at?: string;
				};
				Update: {
					correct_answer?: string;
					created_at?: string;
					explanation?: string;
					id?: string;
					main_text?: string;
					options?: Json | null;
					order_number?: number;
					type?: string;
					updated_at?: string;
				};
				Relationships: [];
			};
			onboarding_skill_votes: {
				Row: {
					created_at: string;
					id: string;
					skills: Json;
					user_id: string;
				};
				Insert: {
					created_at?: string;
					id?: string;
					skills: Json;
					user_id: string;
				};
				Update: {
					created_at?: string;
					id?: string;
					skills?: Json;
					user_id?: string;
				};
				Relationships: [];
			};
			platform_statistics: {
				Row: {
					calculated_at: string;
					id: string;
					stat_key: string;
					stat_value: Json;
				};
				Insert: {
					calculated_at?: string;
					id?: string;
					stat_key: string;
					stat_value: Json;
				};
				Update: {
					calculated_at?: string;
					id?: string;
					stat_key?: string;
					stat_value?: Json;
				};
				Relationships: [];
			};
			platform_statistics_historical: {
				Row: {
					calculated_at: string;
					id: string;
					stat_key: string;
					stat_value: Json;
					week_number: number;
					year: number;
				};
				Insert: {
					calculated_at?: string;
					id?: string;
					stat_key: string;
					stat_value: Json;
					week_number: number;
					year: number;
				};
				Update: {
					calculated_at?: string;
					id?: string;
					stat_key?: string;
					stat_value?: Json;
					week_number?: number;
					year?: number;
				};
				Relationships: [];
			};
			poll_responses: {
				Row: {
					activity_id: string;
					created_at: string;
					id: string;
					selected_option: string;
					user_id: string;
				};
				Insert: {
					activity_id: string;
					created_at?: string;
					id?: string;
					selected_option: string;
					user_id: string;
				};
				Update: {
					activity_id?: string;
					created_at?: string;
					id?: string;
					selected_option?: string;
					user_id?: string;
				};
				Relationships: [
					{
						foreignKeyName: "poll_responses_activity_id_fkey";
						columns: ["activity_id"];
						isOneToOne: false;
						referencedRelation: "activities";
						referencedColumns: ["id"];
					}
				];
			};
			profiles: {
				Row: {
					access_code: string | null;
					access_granted: boolean | null;
					country: string | null;
					created_at: string;
					dark_points: number | null;
					email: string | null;
					email_alerts: boolean | null;
					favorite_emoji: string | null;
					flag: string | null;
					flow_balance: number | null;
					flow_last_updated_at: string | null;
					focus_balance: number;
					focus_last_updated_at: string | null;
					grey_points: number | null;
					id: string;
					invited_by: string | null;
					last_active: string | null;
					name: string | null;
					onboarding_completed: boolean | null;
					poll_sharing: boolean;
					push_notifications: boolean | null;
					score_sharing: boolean;
					streak: number | null;
					streak_protection: boolean | null;
					strikes: number;
					tags: string[] | null;
					thumbnail: string | null;
					updated_at: string;
				};
				Insert: {
					access_code?: string | null;
					access_granted?: boolean | null;
					country?: string | null;
					created_at?: string;
					dark_points?: number | null;
					email?: string | null;
					email_alerts?: boolean | null;
					favorite_emoji?: string | null;
					flag?: string | null;
					flow_balance?: number | null;
					flow_last_updated_at?: string | null;
					focus_balance?: number;
					focus_last_updated_at?: string | null;
					grey_points?: number | null;
					id: string;
					invited_by?: string | null;
					last_active?: string | null;
					name?: string | null;
					onboarding_completed?: boolean | null;
					poll_sharing?: boolean;
					push_notifications?: boolean | null;
					score_sharing?: boolean;
					streak?: number | null;
					streak_protection?: boolean | null;
					strikes?: number;
					tags?: string[] | null;
					thumbnail?: string | null;
					updated_at?: string;
				};
				Update: {
					access_code?: string | null;
					access_granted?: boolean | null;
					country?: string | null;
					created_at?: string;
					dark_points?: number | null;
					email?: string | null;
					email_alerts?: boolean | null;
					favorite_emoji?: string | null;
					flag?: string | null;
					flow_balance?: number | null;
					flow_last_updated_at?: string | null;
					focus_balance?: number;
					focus_last_updated_at?: string | null;
					grey_points?: number | null;
					id?: string;
					invited_by?: string | null;
					last_active?: string | null;
					name?: string | null;
					onboarding_completed?: boolean | null;
					poll_sharing?: boolean;
					push_notifications?: boolean | null;
					score_sharing?: boolean;
					streak?: number | null;
					streak_protection?: boolean | null;
					strikes?: number;
					tags?: string[] | null;
					thumbnail?: string | null;
					updated_at?: string;
				};
				Relationships: [
					{
						foreignKeyName: "profiles_access_code_fkey";
						columns: ["access_code"];
						isOneToOne: false;
						referencedRelation: "access_codes";
						referencedColumns: ["id"];
					},
					{
						foreignKeyName: "profiles_access_code_fkey";
						columns: ["access_code"];
						isOneToOne: false;
						referencedRelation: "invite_info";
						referencedColumns: ["access_code_id"];
					},
					{
						foreignKeyName: "profiles_invited_by_fkey";
						columns: ["invited_by"];
						isOneToOne: false;
						referencedRelation: "access_codes";
						referencedColumns: ["id"];
					},
					{
						foreignKeyName: "profiles_invited_by_fkey";
						columns: ["invited_by"];
						isOneToOne: false;
						referencedRelation: "invite_info";
						referencedColumns: ["access_code_id"];
					}
				];
			};
			quest_submissions: {
				Row: {
					admin_comment: string | null;
					created_at: string;
					id: string;
					image: string | null;
					sidequest_id: string;
					status: string;
					updated_at: string;
					user_comment: string | null;
					user_description: string | null;
					user_id: string;
					user_sidequest_id: string | null;
				};
				Insert: {
					admin_comment?: string | null;
					created_at?: string;
					id?: string;
					image?: string | null;
					sidequest_id: string;
					status?: string;
					updated_at?: string;
					user_comment?: string | null;
					user_description?: string | null;
					user_id: string;
					user_sidequest_id?: string | null;
				};
				Update: {
					admin_comment?: string | null;
					created_at?: string;
					id?: string;
					image?: string | null;
					sidequest_id?: string;
					status?: string;
					updated_at?: string;
					user_comment?: string | null;
					user_description?: string | null;
					user_id?: string;
					user_sidequest_id?: string | null;
				};
				Relationships: [
					{
						foreignKeyName: "quest_submissions_sidequest_id_fkey";
						columns: ["sidequest_id"];
						isOneToOne: false;
						referencedRelation: "sidequests";
						referencedColumns: ["id"];
					},
					{
						foreignKeyName: "quest_submissions_user_sidequest_id_fkey";
						columns: ["user_sidequest_id"];
						isOneToOne: false;
						referencedRelation: "user_sidequests";
						referencedColumns: ["id"];
					}
				];
			};
			self_exploration_quest_stats: {
				Row: {
					id: string;
					quest_id: string;
					result_category: string;
					updated_at: string;
					user_count: number;
				};
				Insert: {
					id?: string;
					quest_id: string;
					result_category: string;
					updated_at?: string;
					user_count?: number;
				};
				Update: {
					id?: string;
					quest_id?: string;
					result_category?: string;
					updated_at?: string;
					user_count?: number;
				};
				Relationships: [
					{
						foreignKeyName: "self_exploration_quest_stats_quest_id_fkey";
						columns: ["quest_id"];
						isOneToOne: false;
						referencedRelation: "self_exploration_quests";
						referencedColumns: ["id"];
					}
				];
			};
			self_exploration_quests: {
				Row: {
					completion_count: number | null;
					created_at: string;
					custom_prompt: string | null;
					dark_token_reward: number;
					description: string;
					grey_token_reward: number;
					grey_unlock: number | null;
					icon: string | null;
					id: string;
					image: string | null;
					personalised_result: string | null;
					quest_type: string | null;
					questions: Json | null;
					show_quest_social_stats: boolean | null;
					status: string;
					title: string;
					topic_id: string | null;
				};
				Insert: {
					completion_count?: number | null;
					created_at?: string;
					custom_prompt?: string | null;
					dark_token_reward?: number;
					description: string;
					grey_token_reward?: number;
					grey_unlock?: number | null;
					icon?: string | null;
					id?: string;
					image?: string | null;
					personalised_result?: string | null;
					quest_type?: string | null;
					questions?: Json | null;
					show_quest_social_stats?: boolean | null;
					status?: string;
					title: string;
					topic_id?: string | null;
				};
				Update: {
					completion_count?: number | null;
					created_at?: string;
					custom_prompt?: string | null;
					dark_token_reward?: number;
					description?: string;
					grey_token_reward?: number;
					grey_unlock?: number | null;
					icon?: string | null;
					id?: string;
					image?: string | null;
					personalised_result?: string | null;
					quest_type?: string | null;
					questions?: Json | null;
					show_quest_social_stats?: boolean | null;
					status?: string;
					title?: string;
					topic_id?: string | null;
				};
				Relationships: [
					{
						foreignKeyName: "fk_self_exploration_quests_topic";
						columns: ["topic_id"];
						isOneToOne: false;
						referencedRelation: "topics";
						referencedColumns: ["id"];
					}
				];
			};
			self_exploration_responses: {
				Row: {
					created_at: string;
					id: string;
					quest_id: string;
					question_index: number;
					question_text: string;
					response_value: string;
					session_id: string;
					user_id: string;
				};
				Insert: {
					created_at?: string;
					id?: string;
					quest_id: string;
					question_index: number;
					question_text: string;
					response_value: string;
					session_id: string;
					user_id: string;
				};
				Update: {
					created_at?: string;
					id?: string;
					quest_id?: string;
					question_index?: number;
					question_text?: string;
					response_value?: string;
					session_id?: string;
					user_id?: string;
				};
				Relationships: [
					{
						foreignKeyName: "self_exploration_responses_quest_id_fkey";
						columns: ["quest_id"];
						isOneToOne: false;
						referencedRelation: "self_exploration_quests";
						referencedColumns: ["id"];
					}
				];
			};
			self_exploration_results: {
				Row: {
					ai_response: string;
					created_at: string;
					id: string;
					prompt_used: string;
					quest_id: string;
					responses_data: Json;
					session_id: string;
					user_id: string;
					version_number: number;
				};
				Insert: {
					ai_response: string;
					created_at?: string;
					id?: string;
					prompt_used: string;
					quest_id: string;
					responses_data: Json;
					session_id: string;
					user_id: string;
					version_number?: number;
				};
				Update: {
					ai_response?: string;
					created_at?: string;
					id?: string;
					prompt_used?: string;
					quest_id?: string;
					responses_data?: Json;
					session_id?: string;
					user_id?: string;
					version_number?: number;
				};
				Relationships: [
					{
						foreignKeyName: "self_exploration_results_quest_id_fkey";
						columns: ["quest_id"];
						isOneToOne: false;
						referencedRelation: "self_exploration_quests";
						referencedColumns: ["id"];
					}
				];
			};
			self_exploration_retakes: {
				Row: {
					id: string;
					quest_id: string;
					retake_count: number;
					retake_date: string;
					user_id: string;
				};
				Insert: {
					id?: string;
					quest_id: string;
					retake_count?: number;
					retake_date?: string;
					user_id: string;
				};
				Update: {
					id?: string;
					quest_id?: string;
					retake_count?: number;
					retake_date?: string;
					user_id?: string;
				};
				Relationships: [
					{
						foreignKeyName: "self_exploration_retakes_quest_id_fkey";
						columns: ["quest_id"];
						isOneToOne: false;
						referencedRelation: "self_exploration_quests";
						referencedColumns: ["id"];
					}
				];
			};
			sidequests: {
				Row: {
					completion_count: number | null;
					created_at: string;
					dark_token_reward: number;
					description: string;
					expiry: string | null;
					grey_token_reward: number;
					grey_unlock: number | null;
					icon: string | null;
					id: string;
					image: string | null;
					instructions: string | null;
					require_description: boolean | null;
					require_image: boolean | null;
					status: string;
					title: string;
					topic_id: string | null;
				};
				Insert: {
					completion_count?: number | null;
					created_at?: string;
					dark_token_reward?: number;
					description: string;
					expiry?: string | null;
					grey_token_reward?: number;
					grey_unlock?: number | null;
					icon?: string | null;
					id?: string;
					image?: string | null;
					instructions?: string | null;
					require_description?: boolean | null;
					require_image?: boolean | null;
					status?: string;
					title: string;
					topic_id?: string | null;
				};
				Update: {
					completion_count?: number | null;
					created_at?: string;
					dark_token_reward?: number;
					description?: string;
					expiry?: string | null;
					grey_token_reward?: number;
					grey_unlock?: number | null;
					icon?: string | null;
					id?: string;
					image?: string | null;
					instructions?: string | null;
					require_description?: boolean | null;
					require_image?: boolean | null;
					status?: string;
					title?: string;
					topic_id?: string | null;
				};
				Relationships: [
					{
						foreignKeyName: "sidequests_topic_id_fkey";
						columns: ["topic_id"];
						isOneToOne: false;
						referencedRelation: "topics";
						referencedColumns: ["id"];
					}
				];
			};
			skill_vote_counts: {
				Row: {
					created_at: string | null;
					id: string;
					last_updated: string | null;
					skill_name: string;
					vote_count: number;
				};
				Insert: {
					created_at?: string | null;
					id?: string;
					last_updated?: string | null;
					skill_name: string;
					vote_count?: number;
				};
				Update: {
					created_at?: string | null;
					id?: string;
					last_updated?: string | null;
					skill_name?: string;
					vote_count?: number;
				};
				Relationships: [];
			};
			sources: {
				Row: {
					author: string;
					created_at: string;
					id: string;
					image_url: string | null;
					source_type: string;
					title: string;
					updated_at: string;
				};
				Insert: {
					author: string;
					created_at?: string;
					id?: string;
					image_url?: string | null;
					source_type: string;
					title: string;
					updated_at?: string;
				};
				Update: {
					author?: string;
					created_at?: string;
					id?: string;
					image_url?: string | null;
					source_type?: string;
					title?: string;
					updated_at?: string;
				};
				Relationships: [];
			};
			store_item_notifications: {
				Row: {
					created_at: string;
					id: string;
					item_id: string;
					user_id: string;
				};
				Insert: {
					created_at?: string;
					id?: string;
					item_id: string;
					user_id: string;
				};
				Update: {
					created_at?: string;
					id?: string;
					item_id?: string;
					user_id?: string;
				};
				Relationships: [
					{
						foreignKeyName: "store_item_notifications_item_id_fkey";
						columns: ["item_id"];
						isOneToOne: false;
						referencedRelation: "store_items";
						referencedColumns: ["id"];
					}
				];
			};
			store_items: {
				Row: {
					created_at: string | null;
					dark_price: number | null;
					description: string;
					grey_to_unlock: number | null;
					id: string;
					images: string[];
					ishidden: boolean | null;
					name: string;
					release_date: string | null;
					state: string;
					story: string | null;
					stripe_product_id: string | null;
					updated_at: string | null;
					usd_price: number | null;
				};
				Insert: {
					created_at?: string | null;
					dark_price?: number | null;
					description: string;
					grey_to_unlock?: number | null;
					id?: string;
					images: string[];
					ishidden?: boolean | null;
					name: string;
					release_date?: string | null;
					state?: string;
					story?: string | null;
					stripe_product_id?: string | null;
					updated_at?: string | null;
					usd_price?: number | null;
				};
				Update: {
					created_at?: string | null;
					dark_price?: number | null;
					description?: string;
					grey_to_unlock?: number | null;
					id?: string;
					images?: string[];
					ishidden?: boolean | null;
					name?: string;
					release_date?: string | null;
					state?: string;
					story?: string | null;
					stripe_product_id?: string | null;
					updated_at?: string | null;
					usd_price?: number | null;
				};
				Relationships: [];
			};
			store_orders: {
				Row: {
					completed_at: string | null;
					created_at: string;
					dark_points_spent: number;
					id: string;
					status: string;
					store_item_id: string;
					stripe_session_id: string;
					usd_amount: number;
					user_id: string;
				};
				Insert: {
					completed_at?: string | null;
					created_at?: string;
					dark_points_spent: number;
					id?: string;
					status?: string;
					store_item_id: string;
					stripe_session_id: string;
					usd_amount: number;
					user_id: string;
				};
				Update: {
					completed_at?: string | null;
					created_at?: string;
					dark_points_spent?: number;
					id?: string;
					status?: string;
					store_item_id?: string;
					stripe_session_id?: string;
					usd_amount?: number;
					user_id?: string;
				};
				Relationships: [
					{
						foreignKeyName: "shop_transactions_shop_item_id_fkey";
						columns: ["store_item_id"];
						isOneToOne: false;
						referencedRelation: "store_items";
						referencedColumns: ["id"];
					}
				];
			};
			system_logs: {
				Row: {
					created_at: string | null;
					details: Json | null;
					id: string;
					operation: string;
				};
				Insert: {
					created_at?: string | null;
					details?: Json | null;
					id?: string;
					operation: string;
				};
				Update: {
					created_at?: string | null;
					details?: Json | null;
					id?: string;
					operation?: string;
				};
				Relationships: [];
			};
			test_scores: {
				Row: {
					created_at: string | null;
					id: string;
					score: number | null;
					test_id: string;
					user_id: string;
				};
				Insert: {
					created_at?: string | null;
					id?: string;
					score?: number | null;
					test_id: string;
					user_id: string;
				};
				Update: {
					created_at?: string | null;
					id?: string;
					score?: number | null;
					test_id?: string;
					user_id?: string;
				};
				Relationships: [
					{
						foreignKeyName: "test_scores_test_id_fkey";
						columns: ["test_id"];
						isOneToOne: false;
						referencedRelation: "tests";
						referencedColumns: ["id"];
					}
				];
			};
			tests: {
				Row: {
					course_id: string;
					created_at: string;
					id: string;
					level_id: string | null;
					score_average: number | null;
					score_distribution: Json | null;
					test_type: string;
					title: string;
					updated_at: string;
				};
				Insert: {
					course_id?: string | null;
					created_at?: string;
					id?: string;
					level_id?: string | null;
					score_average?: number | null;
					score_distribution?: Json | null;
					test_type: string;
					title: string;
					updated_at?: string;
				};
				Update: {
					course_id?: string | null;
					created_at?: string;
					id?: string;
					level_id?: string | null;
					score_average?: number | null;
					score_distribution?: Json | null;
					test_type?: string;
					title?: string;
					updated_at?: string;
				};
				Relationships: [
					{
						foreignKeyName: "tests_course_id_fkey";
						columns: ["course_id"];
						isOneToOne: false;
						referencedRelation: "courses";
						referencedColumns: ["id"];
					},
					{
						foreignKeyName: "tests_level_id_fkey";
						columns: ["level_id"];
						isOneToOne: false;
						referencedRelation: "levels";
						referencedColumns: ["id"];
					}
				];
			};
			topics: {
				Row: {
					collaborator_id: string | null;
					created_at: string;
					id: string;
					level_id: string;
					order_number: number;
					tags: string[] | null;
					title: string;
					updated_at: string;
				};
				Insert: {
					collaborator_id?: string | null;
					created_at?: string;
					id?: string;
					level_id: string;
					order_number: number;
					tags?: string[] | null;
					title: string;
					updated_at?: string;
				};
				Update: {
					collaborator_id?: string | null;
					created_at?: string;
					id?: string;
					level_id?: string;
					order_number?: number;
					tags?: string[] | null;
					title?: string;
					updated_at?: string;
				};
				Relationships: [
					{
						foreignKeyName: "topics_collaborator_id_fkey";
						columns: ["collaborator_id"];
						isOneToOne: false;
						referencedRelation: "collaborators";
						referencedColumns: ["id"];
					},
					{
						foreignKeyName: "topics_level_id_fkey";
						columns: ["level_id"];
						isOneToOne: false;
						referencedRelation: "levels";
						referencedColumns: ["id"];
					}
				];
			};
			trivia: {
				Row: {
					author_id: string | null;
					body: string;
					course_id: string | null;
					created_at: string;
					id: string;
					image_url: string | null;
				};
				Insert: {
					author_id?: string | null;
					body: string;
					course_id?: string | null;
					created_at?: string;
					id?: string;
					image_url?: string | null;
				};
				Update: {
					author_id?: string | null;
					body?: string;
					course_id?: string | null;
					created_at?: string;
					id?: string;
					image_url?: string | null;
				};
				Relationships: [
					{
						foreignKeyName: "trivia_author_id_fkey";
						columns: ["author_id"];
						isOneToOne: false;
						referencedRelation: "profiles";
						referencedColumns: ["id"];
					},
					{
						foreignKeyName: "trivia_course_id_fkey";
						columns: ["course_id"];
						isOneToOne: false;
						referencedRelation: "courses";
						referencedColumns: ["id"];
					}
				];
			};
			user_completed_topics: {
				Row: {
					course_id: string;
					created_at: string | null;
					id: string;
					level_id: string;
					topic_id: string;
					updated_at: string | null;
					user_id: string;
				};
				Insert: {
					course_id: string;
					created_at?: string | null;
					id?: string;
					level_id: string;
					topic_id: string;
					updated_at?: string | null;
					user_id: string;
				};
				Update: {
					course_id?: string;
					created_at?: string | null;
					id?: string;
					level_id?: string;
					topic_id?: string;
					updated_at?: string | null;
					user_id?: string;
				};
				Relationships: [];
			};
			user_daily_activities: {
				Row: {
					activity_count: number;
					activity_date: string;
					created_at: string | null;
					id: string;
					updated_at: string | null;
					user_id: string;
				};
				Insert: {
					activity_count?: number;
					activity_date: string;
					created_at?: string | null;
					id?: string;
					updated_at?: string | null;
					user_id: string;
				};
				Update: {
					activity_count?: number;
					activity_date?: string;
					created_at?: string | null;
					id?: string;
					updated_at?: string | null;
					user_id?: string;
				};
				Relationships: [];
			};
			user_feedback: {
				Row: {
					comment: string;
					created_at: string;
					id: string;
					user_id: string;
				};
				Insert: {
					comment: string;
					created_at?: string;
					id?: string;
					user_id: string;
				};
				Update: {
					comment?: string;
					created_at?: string;
					id?: string;
					user_id?: string;
				};
				Relationships: [];
			};
			user_friends: {
				Row: {
					created_at: string;
					friend_id: string;
					id: string;
					user_id: string;
				};
				Insert: {
					created_at?: string;
					friend_id: string;
					id?: string;
					user_id: string;
				};
				Update: {
					created_at?: string;
					friend_id?: string;
					id?: string;
					user_id?: string;
				};
				Relationships: [];
			};
			user_inventory: {
				Row: {
					acquired_at: string;
					id: string;
					store_item_id: string;
					transaction_id: string;
					user_id: string;
				};
				Insert: {
					acquired_at?: string;
					id?: string;
					store_item_id: string;
					transaction_id: string;
					user_id: string;
				};
				Update: {
					acquired_at?: string;
					id?: string;
					store_item_id?: string;
					transaction_id?: string;
					user_id?: string;
				};
				Relationships: [
					{
						foreignKeyName: "user_inventory_shop_item_id_fkey";
						columns: ["store_item_id"];
						isOneToOne: false;
						referencedRelation: "store_items";
						referencedColumns: ["id"];
					},
					{
						foreignKeyName: "user_inventory_transaction_id_fkey";
						columns: ["transaction_id"];
						isOneToOne: false;
						referencedRelation: "store_orders";
						referencedColumns: ["id"];
					}
				];
			};
			user_messages: {
				Row: {
					created_at: string;
					id: string;
					image_url: string | null;
					is_read: boolean;
					payload: string;
					read_at: string | null;
					tag: string;
					title: string;
					user_id: string;
				};
				Insert: {
					created_at?: string;
					id?: string;
					image_url?: string | null;
					is_read?: boolean;
					payload: string;
					read_at?: string | null;
					tag: string;
					title: string;
					user_id: string;
				};
				Update: {
					created_at?: string;
					id?: string;
					image_url?: string | null;
					is_read?: boolean;
					payload?: string;
					read_at?: string | null;
					tag?: string;
					title?: string;
					user_id?: string;
				};
				Relationships: [];
			};
			user_progress: {
				Row: {
					course_id: string;
					current_activity_id: string | null;
					current_level_id: string | null;
					current_topic_id: string | null;
					id: string;
					status: string;
					updated_at: string | null;
					user_id: string;
				};
				Insert: {
					course_id: string;
					current_activity_id?: string | null;
					current_level_id?: string | null;
					current_topic_id?: string | null;
					id?: string;
					status: string;
					updated_at?: string | null;
					user_id: string;
				};
				Update: {
					course_id?: string;
					current_activity_id?: string | null;
					current_level_id?: string | null;
					current_topic_id?: string | null;
					id?: string;
					status?: string;
					updated_at?: string | null;
					user_id?: string;
				};
				Relationships: [
					{
						foreignKeyName: "fk_current_topic";
						columns: ["current_topic_id"];
						isOneToOne: false;
						referencedRelation: "topics";
						referencedColumns: ["id"];
					},
					{
						foreignKeyName: "fk_user_progress_activity";
						columns: ["current_activity_id"];
						isOneToOne: false;
						referencedRelation: "activities";
						referencedColumns: ["id"];
					},
					{
						foreignKeyName: "fk_user_progress_course";
						columns: ["course_id"];
						isOneToOne: false;
						referencedRelation: "courses";
						referencedColumns: ["id"];
					},
					{
						foreignKeyName: "fk_user_progress_level";
						columns: ["current_level_id"];
						isOneToOne: false;
						referencedRelation: "levels";
						referencedColumns: ["id"];
					},
					{
						foreignKeyName: "fk_user_progress_topic";
						columns: ["current_topic_id"];
						isOneToOne: false;
						referencedRelation: "topics";
						referencedColumns: ["id"];
					},
					{
						foreignKeyName: "user_progress_current_activity_id_fkey";
						columns: ["current_activity_id"];
						isOneToOne: false;
						referencedRelation: "activities";
						referencedColumns: ["id"];
					},
					{
						foreignKeyName: "user_progress_current_level_id_fkey";
						columns: ["current_level_id"];
						isOneToOne: false;
						referencedRelation: "levels";
						referencedColumns: ["id"];
					}
				];
			};
			user_review_activities: {
				Row: {
					id: string;
					user_id: string;
					activity_id: string;
					created_at: string;
					next_review: string | null;
					stability: number | null;
					difficulty: number | null;
					elapsed_days: number | null;
					scheduled_days: number | null;
					learning_steps: number | null;
					reps: number | null;
					lapses: number | null;
					state: string;
					last_review: string | null;
				};
				Insert: {
					user_id: string;
					activity_id: string;
					created_at: string;
					next_review: string;
					stability: number;
					difficulty: number;
					elapsed_days: number;
					scheduled_days: number;
					learning_steps: number;
					reps: number;
					lapses: number;
					state: string;
					last_review: string;
				};
				Update: {
					stability?: number;
					difficulty?: number;
					elapsed_days?: number;
					scheduled_days?: number;
					learning_steps?: number;
					reps?: number;
					lapses?: number;
					state?: string;
					last_review?: string;
					next_review?: string;
				};
				Relationships: [
					{
						foreignKeyName: "user_review_activities_activity_id_fkey";
						columns: ["activity_id"];
						isOneToOne: false;
						referencedRelation: "activities";
						referencedColumns: ["id"];
					}
				];
			};
			user_roles: {
				Row: {
					created_at: string;
					id: string;
					role: Database["public"]["Enums"]["user_role"];
					user_id: string;
				};
				Insert: {
					created_at?: string;
					id?: string;
					role?: Database["public"]["Enums"]["user_role"];
					user_id: string;
				};
				Update: {
					created_at?: string;
					id?: string;
					role?: Database["public"]["Enums"]["user_role"];
					user_id?: string;
				};
				Relationships: [];
			};
			user_self_exploration_quests: {
				Row: {
					completed_at: string | null;
					created_at: string;
					current_question_index: number | null;
					id: string;
					is_hidden: boolean | null;
					progress: number | null;
					rewards_claimed: boolean;
					self_exploration_quest_id: string;
					session_id: string | null;
					state: string;
					user_id: string;
				};
				Insert: {
					completed_at?: string | null;
					created_at?: string;
					current_question_index?: number | null;
					id?: string;
					is_hidden?: boolean | null;
					progress?: number | null;
					rewards_claimed?: boolean;
					self_exploration_quest_id: string;
					session_id?: string | null;
					state?: string;
					user_id: string;
				};
				Update: {
					completed_at?: string | null;
					created_at?: string;
					current_question_index?: number | null;
					id?: string;
					is_hidden?: boolean | null;
					progress?: number | null;
					rewards_claimed?: boolean;
					self_exploration_quest_id?: string;
					session_id?: string | null;
					state?: string;
					user_id?: string;
				};
				Relationships: [
					{
						foreignKeyName: "user_self_exploration_quests_self_exploration_quest_id_fkey";
						columns: ["self_exploration_quest_id"];
						isOneToOne: false;
						referencedRelation: "self_exploration_quests";
						referencedColumns: ["id"];
					}
				];
			};
			user_sidequests: {
				Row: {
					completed_at: string | null;
					created_at: string;
					id: string;
					is_hidden: boolean | null;
					progress: number | null;
					rewards_claimed: boolean;
					sidequest_id: string;
					state: string;
					user_id: string;
				};
				Insert: {
					completed_at?: string | null;
					created_at?: string;
					id?: string;
					is_hidden?: boolean | null;
					progress?: number | null;
					rewards_claimed?: boolean;
					sidequest_id: string;
					state?: string;
					user_id: string;
				};
				Update: {
					completed_at?: string | null;
					created_at?: string;
					id?: string;
					is_hidden?: boolean | null;
					progress?: number | null;
					rewards_claimed?: boolean;
					sidequest_id?: string;
					state?: string;
					user_id?: string;
				};
				Relationships: [
					{
						foreignKeyName: "user_sidequests_sidequest_id_fkey";
						columns: ["sidequest_id"];
						isOneToOne: false;
						referencedRelation: "sidequests";
						referencedColumns: ["id"];
					}
				];
			};
			user_test_scores: {
				Row: {
					completed_at: string;
					id: string;
					passed: boolean | null;
					score: number | null;
					test_id: string;
					test_type: string | null;
					user_id: string;
				};
				Insert: {
					completed_at?: string;
					id?: string;
					passed?: boolean | null;
					score?: number | null;
					test_id: string;
					test_type?: string | null;
					user_id: string;
				};
				Update: {
					completed_at?: string;
					id?: string;
					passed?: boolean | null;
					score?: number | null;
					test_id?: string;
					test_type?: string | null;
					user_id?: string;
				};
				Relationships: [
					{
						foreignKeyName: "user_test_results_test_id_fkey";
						columns: ["test_id"];
						isOneToOne: false;
						referencedRelation: "tests";
						referencedColumns: ["id"];
					}
				];
			};
			user_transactions: {
				Row: {
					created_at: string;
					dark_points: number | null;
					details: string | null;
					grey_points: number | null;
					id: string;
					user_id: string;
				};
				Insert: {
					created_at?: string;
					dark_points?: number | null;
					details?: string | null;
					grey_points?: number | null;
					id?: string;
					user_id: string;
				};
				Update: {
					created_at?: string;
					dark_points?: number | null;
					details?: string | null;
					grey_points?: number | null;
					id?: string;
					user_id?: string;
				};
				Relationships: [];
			};
		};
		Views: {
			admin_audit_logs_view: {
				Row: {
					action_type: string | null;
					admin_id: string | null;
					admin_name: string | null;
					created_at: string | null;
					details: string | null;
					entity_id: string | null;
					entity_type: string | null;
					id: string | null;
					ip_address: string | null;
					new_state: Json | null;
					previous_state: Json | null;
				};
				Relationships: [
					{
						foreignKeyName: "admin_audit_logs_admin_id_fkey";
						columns: ["admin_id"];
						isOneToOne: false;
						referencedRelation: "profiles";
						referencedColumns: ["id"];
					}
				];
			};
			invite_info: {
				Row: {
					access_code: string | null;
					access_code_id: string | null;
					inviter_email: string | null;
					inviter_id: string | null;
					inviter_name: string | null;
				};
				Relationships: [];
			};
		};
		Functions: {
			advance_to_next_topic: {
				Args: {
					p_user_id: string;
					p_course_id: string;
					p_current_topic_id: string;
				};
				Returns: undefined;
			};
			approve_activity_submission: {
				Args: { p_submission_id: string };
				Returns: string;
			};
			archive_weekly_statistics: {
				Args: Record<PropertyKey, never>;
				Returns: undefined;
			};
			award_level_points: {
				Args: { p_user_id: string; p_level_number: number };
				Returns: undefined;
			};
			calculate_activation_rate: {
				Args: Record<PropertyKey, never>;
				Returns: number;
			};
			calculate_avg_topics_per_user: {
				Args: Record<PropertyKey, never>;
				Returns: number;
			};
			calculate_churn_rate: {
				Args: Record<PropertyKey, never>;
				Returns: number;
			};
			calculate_course_users_inprogress: {
				Args: Record<PropertyKey, never>;
				Returns: Json;
			};
			calculate_daily_active_users: {
				Args: Record<PropertyKey, never>;
				Returns: number;
			};
			calculate_monthly_active_users: {
				Args: Record<PropertyKey, never>;
				Returns: number;
			};
			calculate_new_user_signups: {
				Args: Record<PropertyKey, never>;
				Returns: number;
			};
			calculate_onboarding_completion_rate: {
				Args: Record<PropertyKey, never>;
				Returns: number;
			};
			calculate_popular_courses: {
				Args: Record<PropertyKey, never>;
				Returns: Json;
			};
			calculate_popular_skills: {
				Args: Record<PropertyKey, never>;
				Returns: Json;
			};
			calculate_referral_rate: {
				Args: Record<PropertyKey, never>;
				Returns: number;
			};
			calculate_sidequest_completion: {
				Args: Record<PropertyKey, never>;
				Returns: Json;
			};
			calculate_test_statistics: {
				Args: Record<PropertyKey, never>;
				Returns: undefined;
			};
			calculate_topic_score_percentage: {
				Args: Record<PropertyKey, never>;
				Returns: undefined;
			};
			check_and_reset_streaks: {
				Args: Record<PropertyKey, never>;
				Returns: undefined;
			};
			check_course_completion: {
				Args: { p_user_id: string; p_course_id: string };
				Returns: boolean;
			};
			check_level_completion: {
				Args: { p_user_id: string; p_level_id: string };
				Returns: boolean;
			};
			check_submission_not_approved: {
				Args: { sidequest_uuid: string; user_uuid: string };
				Returns: boolean;
			};
			complete_activity: {
				Args: { p_user_id: string; p_activity_id: string };
				Returns: undefined;
			};
			count_message_recipients: {
				Args: {
					p_min_grey?: number;
					p_min_dark?: number;
					p_min_streak?: number;
					p_courses?: string[];
					p_country?: string;
					p_user_tags?: string[];
				};
				Returns: number;
			};
			count_user_rated_activities: {
				Args: { p_user_id: string };
				Returns: number;
			};
			create_user_profile: {
				Args: { p_user_id: string; p_email: string; p_name?: string };
				Returns: boolean;
			};
			days_since_signup: {
				Args: { p_user_id: string };
				Returns: number;
			};
			deduct_flow_points: {
				Args: { p_user_id: string; p_is_correct: boolean };
				Returns: number;
			};
			deduct_focus_points: {
				Args: { p_user_id: string; p_is_correct: boolean };
				Returns: number;
			};
			ensure_user_has_quests: {
				Args: { user_id: string };
				Returns: undefined;
			};
			generate_valid_access_code: {
				Args: Record<PropertyKey, never>;
				Returns: string;
			};
			get_all_profile_tags: {
				Args: Record<PropertyKey, never>;
				Returns: {
					tag: string;
				}[];
			};
			get_country_from_flag: {
				Args: { flag_emoji: string };
				Returns: string;
			};
			get_first_topic_for_course: {
				Args: { p_course_id: string };
				Returns: string;
			};
			get_next_activity_order_number: {
				Args: { p_topic_id: string };
				Returns: number;
			};
			get_previous_week_statistics: {
				Args: { p_stat_key: string };
				Returns: Json;
			};
			get_store_notification_templates: {
				Args: Record<PropertyKey, never>;
				Returns: {
					key: string;
					title: string;
					message: string;
					description: string;
				}[];
			};
			get_top_skills: {
				Args: { limit_count?: number };
				Returns: {
					skill_name: string;
					vote_count: number;
				}[];
			};
			get_unique_access_code: {
				Args: Record<PropertyKey, never>;
				Returns: string;
			};
			get_user_daily_activity_count: {
				Args: { p_user_id: string; p_date: string };
				Returns: number;
			};
			get_user_feedback_with_details: {
				Args: Record<PropertyKey, never>;
				Returns: {
					id: string;
					user_id: string;
					comment: string;
					created_at: string;
					user_details: Json;
				}[];
			};
			get_user_focus_balance: {
				Args: { p_user_id: string };
				Returns: number;
			};
			handle_invite_signup: {
				Args: { inviter_id: string; invitee_id: string };
				Returns: undefined;
			};
			has_role: {
				Args: {
					user_id: string;
					role: Database["public"]["Enums"]["user_role"];
				};
				Returns: boolean;
			};
			increment: {
				Args: { row_id: string };
				Returns: number;
			};
			increment_dark_points: {
				Args: { p_user_id: string; p_dark_points: number };
				Returns: undefined;
			};
			increment_level_points: {
				Args: { p_user_id: string; p_level_number: number };
				Returns: undefined;
			};
			initialize_user_progress: {
				Args: { p_user_id: string; p_course_id: string };
				Returns: undefined;
			};
			is_admin: {
				Args: { user_id?: string };
				Returns: boolean;
			};
			log_admin_action: {
				Args: {
					admin_id: string;
					action_type: string;
					entity_type: string;
					entity_id?: string;
					previous_state?: Json;
					new_state?: Json;
					details?: string;
					ip_address?: string;
				};
				Returns: string;
			};
			recalculate_skill_vote_counts: {
				Args: Record<PropertyKey, never>;
				Returns: undefined;
			};
			replenish_flow_points: {
				Args: Record<PropertyKey, never>;
				Returns: undefined;
			};
			replenish_focus_points: {
				Args: Record<PropertyKey, never>;
				Returns: undefined;
			};
			send_announcement_to_all_users: {
				Args: { p_title: string; p_message: string; p_tag?: string };
				Returns: number;
			};
			send_filtered_message: {
				Args: {
					p_title: string;
					p_payload: string;
					p_tag?: string;
					p_min_grey?: number;
					p_min_dark?: number;
					p_min_streak?: number;
					p_courses?: string[];
					p_country?: string;
					p_user_tags?: string[];
				};
				Returns: number;
			};
			send_system_message: {
				Args: {
					p_user_id: string;
					p_title: string;
					p_payload: string;
					p_tag?: string;
					p_is_read?: boolean;
				};
				Returns: boolean;
			};
			start_course: {
				Args: { p_user_id: string; p_course_id: string };
				Returns: undefined;
			};
			submit_initial_test: {
				Args: { p_user_id: string; p_test_id: string; p_score: number };
				Returns: undefined;
			};
			submit_level_test: {
				Args: { p_user_id: string; p_test_id: string; p_score: number };
				Returns: undefined;
			};
			sync_topic_quests: {
				Args: { userid: string; topicid: string };
				Returns: undefined;
			};
			update_expired_sidequests: {
				Args: Record<PropertyKey, never>;
				Returns: undefined;
			};
			update_platform_statistics: {
				Args: Record<PropertyKey, never>;
				Returns: undefined;
			};
			update_quest_stats: {
				Args: { p_quest_id: string; p_result_category: string };
				Returns: undefined;
			};
			update_topic_order_numbers: {
				Args: Record<PropertyKey, never>;
				Returns: undefined;
			};
			update_user_sidequest_by_ids: {
				Args: {
					p_user_id: string;
					p_sidequest_id: string;
					p_new_state: string;
					p_completed_at: string;
				};
				Returns: Json;
			};
			update_user_sidequest_state: {
				Args: {
					p_user_sidequest_id: string;
					p_new_state: string;
					p_completed_at: string;
				};
				Returns: Json;
			};
			upsert_activity: {
				Args: {
					p_id: string;
					p_topic_id: string;
					p_type: string;
					p_main_text: string;
					p_options: string[];
					p_correct_answer: string;
					p_explanation: string;
					p_author_id: string;
					p_order_number: number;
					p_correct_answer_count: number;
				};
				Returns: undefined;
			};
			validate_access_code: {
				Args: { p_user_id: string; p_access_code: string };
				Returns: boolean;
			};
		};
		Enums: {
			contributor_application_status: "pending" | "approved" | "rejected";
			item_status: "locked" | "in_progress" | "completed";
			progress_status: "not_started" | "in_progress" | "completed";
			user_role: "user" | "admin" | "contributor";
		};
		CompositeTypes: {
			[_ in never]: never;
		};
	};
};

type DefaultSchema = Database[Extract<keyof Database, "public">];

export type Tables<
	DefaultSchemaTableNameOrOptions extends
		| keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
		| { schema: keyof Database },
	TableName extends DefaultSchemaTableNameOrOptions extends {
		schema: keyof Database;
	}
		? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
				Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
		: never = never
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
	? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
			Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
			Row: infer R;
	  }
		? R
		: never
	: DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
			DefaultSchema["Views"])
	? (DefaultSchema["Tables"] & DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
			Row: infer R;
	  }
		? R
		: never
	: never;

export type TablesInsert<
	DefaultSchemaTableNameOrOptions extends
		| keyof DefaultSchema["Tables"]
		| { schema: keyof Database },
	TableName extends DefaultSchemaTableNameOrOptions extends {
		schema: keyof Database;
	}
		? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
		: never = never
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
	? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
			Insert: infer I;
	  }
		? I
		: never
	: DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
	? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
			Insert: infer I;
	  }
		? I
		: never
	: never;

export type TablesUpdate<
	DefaultSchemaTableNameOrOptions extends
		| keyof DefaultSchema["Tables"]
		| { schema: keyof Database },
	TableName extends DefaultSchemaTableNameOrOptions extends {
		schema: keyof Database;
	}
		? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
		: never = never
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
	? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
			Update: infer U;
	  }
		? U
		: never
	: DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
	? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
			Update: infer U;
	  }
		? U
		: never
	: never;

export type Enums<
	DefaultSchemaEnumNameOrOptions extends
		| keyof DefaultSchema["Enums"]
		| { schema: keyof Database },
	EnumName extends DefaultSchemaEnumNameOrOptions extends {
		schema: keyof Database;
	}
		? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
		: never = never
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
	? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
	: DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
	? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
	: never;

export type CompositeTypes<
	PublicCompositeTypeNameOrOptions extends
		| keyof DefaultSchema["CompositeTypes"]
		| { schema: keyof Database },
	CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
		schema: keyof Database;
	}
		? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
		: never = never
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
	? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
	: PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
	? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
	: never;

export const Constants = {
	public: {
		Enums: {
			contributor_application_status: ["pending", "approved", "rejected"],
			item_status: ["locked", "in_progress", "completed"],
			progress_status: ["not_started", "in_progress", "completed"],
			user_role: ["user", "admin", "contributor"],
		},
	},
} as const;
