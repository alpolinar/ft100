import { Route } from "@/common/routes";
import { Button } from "@/components/ui/button";
import { CircleCheck } from "lucide-react";
import { useRouter } from "next/navigation";

export default function SignUpConfirmation() {
    const router = useRouter();
    return (
        <div className="flex flex-col items-center gap-4">
            <CircleCheck size={48} className="text-primary" />
            <h5 className="text sm:text-xl font-semibold tracking-tight text-center text-black">
                Account Created
            </h5>
            <p>Perfect! You account has been created.</p>
            <Button
                className="w-full"
                onClick={() => {
                    router.push(Route.game);
                }}
            >
                Continue
            </Button>
        </div>
    );
}
