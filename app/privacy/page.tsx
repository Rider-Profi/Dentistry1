import type { Metadata } from "next";
import { PageHero } from "@/components/page-hero";
import Link from "next/link";
import { siteConfig } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "Privacy Policy & Demo Disclaimer",
  description: "How the SmileCare portfolio demo handles submitted information, cookies and external services. This is a fictional practice, not a healthcare service."
};

const sections = [
  {
    id: "information", title: "Information you choose to submit",
    paragraphs: [
      "The appointment demo asks for a name and phone number, a treatment, an optional dentist preference, and a preferred date and time. Email and a short note are optional. It also records a request reference, submission time, contact consent and request status. Phone numbers are stored in a consistent international format.",
      "Please use fictional details and do not submit medical histories, symptoms, identity documents or other sensitive information. Real information entered into a demo is still real personal information; the fictional branding does not make it anonymous."
    ]
  },
  {
    id: "purpose", title: "What the demonstration does with this information",
    paragraphs: [
      "When a database is connected, a successful submission creates a record that authorised administrators can view and manage. The request demonstrates booking, validation and notification features. It does not create a real appointment or a clinician–patient relationship.",
      "The application uses an IP address to limit repeated requests. The hosting provider may also keep technical access and error logs. The contact checkbox records your agreement to follow-up about the demonstration request; it is not a medical consent form or a marketing subscription."
    ]
  },
  {
    id: "services", title: "Storage and connected services",
    paragraphs: [
      "Submissions are stored in the database configured by the project owner. If integrations are enabled, request details may also be sent through Resend or an SMTP email provider, Telegram, and AmoCRM. Upstash Redis may support rate limiting, while QStash may schedule notification jobs. Delivery status and errors are recorded to help manage these processes.",
      "Which providers are active, where they process information and how long they retain it depend on the deployment. This demo does not promise UK-only storage. Cloudinary may store profile images uploaded by an administrator; the bundled fictional avatars are served from this website."
    ]
  },
  {
    id: "cookies", title: "Cookies and external links",
    paragraphs: [
      "The administrator sign-in uses authentication and security cookies. This project does not include advertising trackers or analytics scripts. The appointment form holds its current progress in page memory; leaving or reloading the page clears that progress, but does not delete a request already submitted.",
      "Google Maps opens only when you follow a map link. No Google map is embedded on this page. Google and other linked websites apply their own privacy policies once you visit them."
    ]
  },
  {
    id: "retention", title: "Retention and deletion",
    paragraphs: [
      "There is no automatic deletion schedule for submitted requests in this demo. Records remain in the configured database until the project owner deletes them or resets the environment. Copies in connected services or backups may have different retention periods.",
      "Before using this project to collect real personal information, the operator must publish their identity and contact details, purposes and lawful bases, applicable retention periods, and information about their actual providers and any international transfers. This demo policy is not a declaration of legal compliance for a live dental practice."
    ]
  }
];

export default function PrivacyPage() {
  return (
    <>
      <PageHero eyebrow="Your information" title="Privacy, explained clearly.">
        How this portfolio demonstration handles information, and what its fictional setting means for you.
      </PageHero>
      <article className="container-shell max-w-3xl py-12 sm:py-16">
        <p className="text-sm text-ink/70">Last updated <time dateTime="2026-11-08">8 November 2026</time></p>
        <section id="portfolio-demo" className="mt-7 scroll-mt-28 rounded-3xl border border-teal/15 bg-mint/50 p-6 sm:p-8">
          <h2 className="display-title text-3xl">A portfolio project, not a dental practice</h2>
          <p className="mt-5 leading-7 text-ink/80">{siteConfig.demoDisclaimer}</p>
          <p className="mt-4 leading-7 text-ink/80">The avatars are original illustrations. No profile represents a real clinician, verified professional registration or qualification. Patient stories and star ratings are sample copy, not genuine endorsements. Any account of a comfortable or pain-free experience is fictional and is not a guarantee.</p>
          <p className="mt-4 leading-7 text-ink/80">The example address, telephone number and opening hours are not contact details for a dental provider. Do not travel to the address or rely on this website for urgent help. Discuss health concerns with a qualified healthcare professional; do not delay seeking care because of anything on this demo.</p>
        </section>
        <nav aria-label="Privacy policy contents" className="my-10 rounded-2xl border border-ink/10 p-5">
          <p className="font-bold">On this page</p>
          <ul className="mt-3 grid gap-1 text-sm">
            {sections.map(({ id, title }) => <li key={id}><a href={`#${id}`} className="focus-ring inline-block rounded py-2 text-teal underline underline-offset-4">{title}</a></li>)}
            <li><a href="#contact" className="focus-ring inline-block rounded py-2 text-teal underline underline-offset-4">Questions and your rights</a></li>
          </ul>
        </nav>
        {sections.map(({ id, title, paragraphs }) => (
          <section key={id} id={id} className="mt-10 scroll-mt-28">
            <h2 className="display-title text-2xl sm:text-3xl">{title}</h2>
            {paragraphs.map((paragraph) => <p key={paragraph} className="mt-4 leading-7 text-ink/80">{paragraph}</p>)}
          </section>
        ))}
        <section id="contact" className="mt-10 scroll-mt-28">
          <h2 className="display-title text-2xl sm:text-3xl">Questions and your rights</h2>
          <p className="mt-4 leading-7 text-ink/80">If you have submitted real information by mistake, contact the project owner. Depending on the applicable law and circumstances, you may be able to request access, correction or deletion, or raise an objection to how your information is used.</p>
          {siteConfig.privacyEmail ? (
            <p className="mt-4 leading-7">Contact the project owner at <a className="focus-ring break-words rounded text-teal underline underline-offset-4" href={`mailto:${siteConfig.privacyEmail}`}>{siteConfig.privacyEmail}</a>.</p>
          ) : (
            <p className="mt-4 leading-7 text-ink/80">Contact the portfolio owner through the profile or project listing that brought you to this website. A dedicated privacy email has not been published for this deployment. Please do not use the fictional practice details for privacy requests.</p>
          )}
          <p className="mt-4 leading-7 text-ink/80">For information about UK data protection rights and how to raise a concern, visit the <a href="https://ico.org.uk/for-the-public/" target="_blank" rel="noopener noreferrer" className="focus-ring rounded text-teal underline underline-offset-4">Information Commissioner’s Office<span className="sr-only"> (opens in a new tab)</span></a>.</p>
        </section>
        <Link href="/" className="focus-ring mt-10 inline-flex min-h-11 items-center rounded-lg font-bold text-teal underline underline-offset-4">Back to Home</Link>
      </article>
    </>
  );
}
