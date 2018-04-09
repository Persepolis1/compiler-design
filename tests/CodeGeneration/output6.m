entry % Program start
		 addi	 r1, r0, topaddr  % Set frame pointer
		 addi	 r2, r0, topaddr  % Set stack pointer
		 addi	 r14, r0, topaddr  % Set func stack pointer
		 addi	 r12, r0, 100
		 sw	 -8(r2),  r12
		 addi	 r12, r0, 25
		 sw	 -12(r2),  r12
		 lw	 r9, -8(r2)
		 lw	 r10, -12(r2)
		 add	 r11,r9,r10
		 sw	 -16(r2), r11
		 addi	 r9, r0, 60
		 sw	 -20(r2),  r9
		 lw	 r6, -16(r2)
		 lw	 r7, -20(r2)
		 sub	 r8,r6,r7
		 sw	 -24(r2), r8
		 addi	 r6, r0, 15
		 sw	 -28(r2),  r6
		 lw	 r3, -24(r2)
		 lw	 r4, -28(r2)
		 add	 r5,r3,r4
		 sw	 -32(r2), r5
		 lw	 r3, -32(r2)
		 sw	 -4(r2),  r3
		 lw	 r3, -4(r2)
		 sw	 -8(r14), r3
		 addi	 r4,r0,buf
		 sw	 -12(r14), r4
		 jl	 r15, intstr
		 sw	 -8(r14), r13
		 jl	 r15, putstr
		 addi	 r2, r0, topaddr  % Set stack pointer
		 hlt
buf	res	20
