import Link from "next/link";
import { AiOutlineBook } from "react-icons/ai";

export default function StatCard({
    label,
    value,
    Icon,
    href
}: {
    label: string;
    value: string | number;
    Icon: typeof AiOutlineBook;
    href?: string;
}) {
    const content = (
        <div className="rounded-md border bg-white p-5">
            <div className="flex items-center justify-between">
                <div>
                    <div className="text-sm font-medium text-gray-500">{label}</div>
                    <div className="mt-2 text-2xl font-semibold text-gray-900">{value}</div>
                </div>
                <div className="flex h-12 w-12 items-center justify-center rounded-md bg-indigo-50 text-indigo-700">
                    <Icon className="h-6 w-6" />
                </div>
            </div>
        </div>
    );
    return href ? <Link href={href}>{content}</Link> : content;
}