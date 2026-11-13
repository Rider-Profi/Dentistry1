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
    name: string;
    phone: string;
    serviceName: string;
    doctorName: string;
    date: string;
    time: string;
  };
  clinicPhone: string;
};

export function ClientConfirmationEmail({ booking, clinicPhone }: Props) {
  return (
    <Html lang={siteConfig.locale}>
      <Head />
      <Preview>We have received your appointment request</Preview>
      <Body style={body}>
        <Container style={container}>
          <Text style={brand}>{siteConfig.name}</Text>
          <Heading style={heading}>Hello {booking.name.split(" ")[0]}!</Heading>
          <Text style={lead}>We have received your appointment request. The team will contact you during opening hours to agree an appointment. Your preferred time is not confirmed yet.</Text>
          <Section style={card}>
            <Text><b>Treatment:</b> {booking.serviceName}</Text>
            <Text><b>Dentist:</b> {booking.doctorName}</Text>
            <Text><b>Preferred visit:</b> {booking.date}, {booking.time}</Text>
            <Text><b>Contact number:</b> {booking.phone}</Text>
          </Section>
          <Button href={`tel:${clinicPhone.replace(/[^+\d]/g, "")}`} style={button}>Call the team</Button>
          <Hr style={hr} />
          <Text style={muted}>Portfolio demo · Fictional practice · All appointment preferences use London time.</Text>
        </Container>
      </Body>
    </Html>
  );
}

const body = { backgroundColor: "#f6f3eb", fontFamily: "Arial, sans-serif", color: "#17332f" };
const container = { margin: "0 auto", padding: "36px 20px", maxWidth: "600px" };
const brand = { color: "#1f6b5f", fontSize: "12px", fontWeight: "bold", letterSpacing: "1.5px" };
const heading = { fontFamily: "Georgia, serif", fontSize: "34px", fontWeight: "normal" };
const lead = { fontSize: "16px", lineHeight: "26px" };
const card = { backgroundColor: "#ffffff", borderRadius: "20px", padding: "18px 24px", marginTop: "22px" };
const button = { backgroundColor: "#1f6b5f", color: "#ffffff", padding: "14px 22px", borderRadius: "999px", marginTop: "22px" };
const hr = { borderColor: "#dcece7", marginTop: "30px" };
const muted = { color: "#60726e", fontSize: "13px" };
