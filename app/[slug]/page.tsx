import Image from "next/image";
import DialogHandler from "./_components/dialog-handler";

export default function TestimonialPage() {
  return (
    <div className="mx-auto flex max-w-150 flex-col items-center">
      <Image
        src="/placeholder.png"
        alt="testimonial"
        width={160}
        height={30}
        className="rounded"
      />
      <h1 className="mt-10 text-center text-5xl leading-14 font-bold">
        Shoutout to Indigo!
      </h1>
      <p className="text-muted-foreground my-8 text-center text-lg">
        Your shoutout means a lot to us!
      </p>
      <div className="self-start">
        <span className="before:bg-theme-primary relative before:absolute before:-bottom-3 before:h-1 before:w-1/2 before:rounded-[1px] before:content-['']">
          QUESTIONS
        </span>
        <ul className="text-muted-foreground mt-6 list-disc pl-4">
          <li>Who are you / what are you working on?</li>
          <li>How has [our product / service] helped you?</li>
          <li>What is the best thing about [our product / service]</li>
        </ul>
      </div>

      <DialogHandler />
    </div>
  );
}
