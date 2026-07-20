"use server";

import { connectDB } from "@/lib/db/mongoose";
import { Service } from "@/models/Service";
import { Offering } from "@/models/Offering";
import { BlogPost } from "@/models/Blog";
import { Page } from "@/models/Page";
import { TeamMember } from "@/models/TeamMember";
import { FAQ } from "@/models/FAQ";
import { Testimonial } from "@/models/Testimonial";
import { Lead } from "@/models/Lead";
import { MediaAsset } from "@/models/MediaAsset";
import { NewsletterSubscriber } from "@/models/NewsletterSubscriber";
import { getActionContext, notDeletedFilter } from "@/lib/actions/helpers";
import { getLeadStatusCounts } from "@/actions/leads";

export async function getDashboardStats() {
  await getActionContext();
  await connectDB();
  const nd = notDeletedFilter();

  const [
    services,
    offerings,
    blogPosts,
    pages,
    team,
    faqs,
    testimonials,
    leads,
    media,
    subscribers,
    leadStatusCounts,
    recentLeads,
  ] = await Promise.all([
    Service.countDocuments({ ...nd, status: "published" }),
    Offering.countDocuments({ ...nd, status: "published" }),
    BlogPost.countDocuments({ ...nd, status: "published" }),
    Page.countDocuments({ ...nd, status: "published" }),
    TeamMember.countDocuments({ ...nd, status: "published" }),
    FAQ.countDocuments({ ...nd, status: "published" }),
    Testimonial.countDocuments({ ...nd, approved: true }),
    Lead.countDocuments(nd),
    MediaAsset.countDocuments(nd),
    NewsletterSubscriber.countDocuments({ status: "active" }),
    getLeadStatusCounts(),
    Lead.find(nd).sort({ createdAt: -1 }).limit(8).lean(),
  ]);

  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  const leadsByDay = await Lead.aggregate([
    { $match: { ...nd, createdAt: { $gte: thirtyDaysAgo } } },
    {
      $group: {
        _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
        count: { $sum: 1 },
      },
    },
    { $sort: { _id: 1 } },
  ]);

  return {
    counts: {
      services,
      offerings,
      blogPosts,
      pages,
      team,
      faqs,
      testimonials,
      leads,
      media,
      subscribers,
    },
    leadStatusCounts,
    recentLeads: JSON.parse(JSON.stringify(recentLeads)),
    leadsByDay: leadsByDay.map((d) => ({ date: d._id, count: d.count })),
  };
}
