import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Img,
  Section,
  Tailwind,
  Text,
} from "@react-email/components";

interface OtpEmailTemplateProps {
  otp: string;
}

export const OtpEmailTemplate = ({ otp }: OtpEmailTemplateProps) => {
  return (
    <Html>
      <Head />
      <Tailwind>
        <Body className="bg-gray-200 p-6">
          <Container className="mx-auto">
            <div className="bg-white rounded-xl px-5 py-8">
              <Img
                alt="Testimonial"
                className="mx-auto"
                width={250}
                height={66.375}
                src="https://res.cloudinary.com/dwcjzletx/image/upload/v1763717625/Testimonial_1_axf5bt.png"
              />
              <Heading className="text-xl text-center font-medium mt-6">
                Verify email to submit your testimonial
              </Heading>
              <Text className="text-center">
                Thank you for sharing your testimonial! Please enter the OTP
                below to verify your email address and finalize the submission.
              </Text>
              <Section className="bg-gray-200 w-1/2 mx-auto rounded-md">
                <Text className="text-center font-medium text-2xl! tracking-widest">
                  {otp}
                </Text>
              </Section>
              <Text className="text-center text-gray-600">
                The code will remain active for 2 minutes
              </Text>
            </div>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};
