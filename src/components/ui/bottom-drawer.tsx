"use client";

import { Drawer } from "vaul";
import type { ReactNode } from "react";
import { X } from "lucide-react";

interface BottomDrawerProps {
    trigger: ReactNode;
    title: string;
    description?: string;
    children: ReactNode;
    /**
     * Se true, fecha o drawer ao clicar fora dele
     * @default true
     */
    dismissible?: boolean;
}

/**
 * BottomDrawer - Progressive Disclosure Component
 * 
 * Wrapper para a biblioteca vaul que implementa drawers mobile-first.
 * Usado para ocultar listas extensas e detalhes complexos, revelando-os
 * apenas quando o usuário interage com o trigger.
 * 
 * @example
 * ```tsx
 * <BottomDrawer
 *   trigger={<Button>Ver Recursos</Button>}
 *   title="Equipamentos Públicos"
 *   description="Serviços disponíveis na região"
 * >
 *   <ResourceList />
 * </BottomDrawer>
 * ```
 */
export function BottomDrawer({
    trigger,
    title,
    description,
    children,
    dismissible = true,
}: BottomDrawerProps) {
    return (
        <Drawer.Root dismissible={dismissible}>
            <Drawer.Trigger asChild>{trigger}</Drawer.Trigger>
            <Drawer.Portal>
                <Drawer.Overlay className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[var(--z-modal-queue)]" />
                <Drawer.Content
                    className="bg-slate-900 flex flex-col rounded-t-[20px] h-[85vh] mt-24 fixed bottom-0 left-0 right-0 z-[calc(var(--z-modal-queue)+1)] border-t-2 border-slate-700"
                    aria-describedby={description ? "drawer-description" : undefined}
                >
                    {/* Handle Bar */}
                    <div className="mx-auto w-16 h-1.5 flex-shrink-0 rounded-full bg-slate-600 mt-4 mb-6" />

                    {/* Header */}
                    <div className="px-6 pb-4 border-b border-slate-800">
                        <div className="flex items-start justify-between">
                            <div className="flex-1">
                                <Drawer.Title className="font-bold text-2xl text-white mb-2">
                                    {title}
                                </Drawer.Title>
                                {description && (
                                    <Drawer.Description
                                        id="drawer-description"
                                        className="text-slate-400 text-sm"
                                    >
                                        {description}
                                    </Drawer.Description>
                                )}
                            </div>
                            <Drawer.Close className="p-2 rounded-lg hover:bg-slate-800 transition-colors">
                                <X className="w-5 h-5 text-slate-400" />
                                <span className="sr-only">Fechar</span>
                            </Drawer.Close>
                        </div>
                    </div>

                    {/* Scrollable Content */}
                    <div className="flex-1 overflow-auto px-6 py-4">
                        <div className="max-w-2xl mx-auto">{children}</div>
                    </div>
                </Drawer.Content>
            </Drawer.Portal>
        </Drawer.Root>
    );
}
