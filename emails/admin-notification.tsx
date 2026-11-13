import { siteConfig } from "@/lib/site-config";
import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Preview,
  Section,
  Text
} from "@react-email/components";

type Props = {
  booking: {
    id: number;
    name: string;
    phone: string;
    email?: string | null;
    serviceName: string;
    doctorName: string;
    date: string;
    time: string;
    comment?: string | null;
    createdAt: string;
  };
  adminUrl: string;
};

export function AdminNotificationEmail({ booking, adminUrl }: Props) {
  return (
    <Html lang={siteConfig.locale}>
      <Head />
      <Preview>New appointment request — {booking.name}</Preview>
      <Body style={body}>
        <Container style={container}>
          <Text style={brand}>{siteConfig.name}</Text>
          <Heading style={heading}>New appointment request</Heading>
          <Section style={card}>
            <Text><b>Name:</b> {booking.name}</Text>
            <Text><b>Phone:</b> {booking.phone}</Text>
            {booking.email && <Text><b>Email:</b> {booking.email}</Text>}
            <Text><b>Treatment:</b> {booking.serviceName}</Text>
            <Text><b>Dentist:</b> {booking.doctorName}</Text>
            <Text><b>Preferred visit:</b> {booking.date}, {booking.time}</Text>
            {booking.comment && <Text><b>Note:</b> {booking.comment}</Text>}
            <Hr style={hr} />
            <Text style={muted}>Received: {booking.createdAt}</Text>
          </Section>
          <Button href={adminUrl} style={button}>View request</Button>
        </Container>
      </Body>
    </Html>
  );
}

const body = { backgroundColor: "#f6f3eb", fontFamily: "Arial, sans-serif", color: "#17332f" };
const container = { margin: "0 auto", padding: "36px 20px", maxWidth: "600px" };
const brand = { color: "#1f6b5f", fontSize: "12px", fontWeight: "bold", letterSpacing: "1.5px" };
const heading = { fontFamily: "Georgia, serif", fontSize: "34px", fontWeight: "normal" };
const card = { backgroundColor: "#ffffff", borderRadius: "20px", padding: "18px 24px" };
const hr = { borderColor: "#dcece7" };
const muted = { color: "#60726e", fontSize: "13px" };
const button = { backgroundColor: "#1f6b5f", color: "#ffffff", padding: "14px 22px", borderRadius: "999px", marginTop: "22px" };
