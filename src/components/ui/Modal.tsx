import { useEffect, useRef, type MouseEvent, type ReactNode } from 'react';

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title?: string;
    children: ReactNode;
    size?: 'sm' | 'md' | 'lg' | 'xl';
}

const sizeClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
};

export function Modal({
    isOpen,
    onClose,
    title,
    children,
    size = 'md',
}: ModalProps) {
    const dialogRef = useRef<HTMLDialogElement>(null);

    useEffect(() => {
        const dialog = dialogRef.current;

        if (!dialog) {
            return;
        }

        if (isOpen) {
            dialog.showModal();
        } else {
            dialog.close();
        }
    }, [isOpen]);

    useEffect(() => {
        const dialog = dialogRef.current;

        if (!dialog) {
            return;
        }

        const handleClose = () => onClose();

        dialog.addEventListener('close', handleClose);

        return () => {
            dialog.removeEventListener('close', handleClose);
        };
    }, [onClose]);

    function handleBackdropClick(event: MouseEvent<HTMLDialogElement>) {
        if (event.target === dialogRef.current) {
            onClose();
        }
    }

    if (!isOpen) {
        return null;
    }

    return (
        <dialog
            ref={dialogRef}
            onClick={handleBackdropClick}
            className={`w-full rounded-xl bg-white p-0 shadow-xl backdrop:bg-black/50 ${sizeClasses[size]}`}
        >
            <div>
                {title && (
                    <div className="flex items-center justify-between border-b px-5 py-4">
                        <h2 className="text-lg font-semibold text-gray-900">
                            {title}
                        </h2>

                        <button
                            type="button"
                            onClick={onClose}
                            className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-900"
                            aria-label="Close modal"
                        >
                            <svg
                                width="20"
                                height="20"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                            >
                                <line x1="18" y1="6" x2="6" y2="18" />
                                <line x1="6" y1="6" x2="18" y2="18" />
                            </svg>
                        </button>
                    </div>
                )}

                <div className="p-5">
                    {children}
                </div>
            </div>
        </dialog>
    );
}