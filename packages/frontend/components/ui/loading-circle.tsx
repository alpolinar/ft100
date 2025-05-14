import { LoaderCircle } from "lucide-react";

export default function LoadingCircle(
    props: React.ComponentProps<typeof LoaderCircle>
) {
    return <LoaderCircle className="animate-spin" {...props} />;
}
