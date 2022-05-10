import {
  AfterLoad,
  BeforeInsert,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
  UpdateDateColumn,
} from "typeorm"
import { ulid } from "ulid"
import { BatchJobStatus } from "../types/batch-job"
import { DbAwareColumn, resolveDbType } from "../utils/db-aware-column"
import { User } from "./user"

@Entity()
export class BatchJob {
  @PrimaryColumn()
  id: string

  @DbAwareColumn({ type: "text" })
  type: string

  status: BatchJobStatus

  @Column({ nullable: true })
  created_by: string | null

  @ManyToOne(() => User)
  @JoinColumn({ name: "created_by" })
  created_by_user: User

  @DbAwareColumn({ type: "jsonb", nullable: true })
  context: Record<string, unknown>

  @DbAwareColumn({ type: "jsonb", nullable: true })
  result: Record<string, unknown>

  @Column({ type: resolveDbType("timestamptz"), nullable: true })
  processing_at: Date | null

  @Column({ type: resolveDbType("timestamptz"), nullable: true })
  awaiting_confirmation_at: Date | null

  @Column({ type: resolveDbType("timestamptz"), nullable: true })
  confirmed_at: Date | null

  @Column({ type: resolveDbType("timestamptz"), nullable: true })
  completed_at: Date | null

  @Column({ type: resolveDbType("timestamptz"), nullable: true })
  cancelled_at: Date | null

  @CreateDateColumn({ type: resolveDbType("timestamptz") })
  created_at: Date

  @UpdateDateColumn({ type: resolveDbType("timestamptz") })
  updated_at: Date

  @DeleteDateColumn({ type: resolveDbType("timestamptz") })
  deleted_at: Date | null

  @AfterLoad()
  loadStatus(): void {
    if (this.cancelled_at) {
      this.status = BatchJobStatus.CANCELLED
    } else if (this.completed_at) {
      this.status = BatchJobStatus.COMPLETED
    } else if (this.confirmed_at) {
      this.status = BatchJobStatus.CONFIRMED
    } else if (this.awaiting_confirmation_at) {
      this.status = BatchJobStatus.AWAITING_CONFIRMATION
    } else if (this.processing_at) {
      this.status = BatchJobStatus.PROCESSING
    } else {
      this.status = BatchJobStatus.CREATED
    }
  }

  @BeforeInsert()
  private beforeInsert() {
    if (this.id) {
      return
    }
    const id = ulid()
    this.id = `batch_${id}`
  }
}

/**
 * @schema batch_job
 * title: "Batch Job"
 * description: "A Batch Job."
 * x-resourceId: batch_job
 * properties:
 *  id:
 *    description: "The unique identifier for the batch job."
 *    type: string
 *  type:
 *    description: "The type of batch job."
 *    type: string
 *    enum:
 *      - product_import
 *      - product_export
 *  status:
 *    description: "The status of the batch job."
 *    type: string
 *    enum:
 *      - created
 *      - processing
 *      - awaiting_confirmation
 *      - completed
 *  created_by:
 *    description: "The unique identifier of the user that created the batch job."
 *    type: string
 *  context:
 *    description: "The context of the batch job, the type of the batch job determines what the context should contain."
 *    type: object
 *  result:
 *    description: "The result of the batch job."
 *    type: object
 *  created_at:
 *    description: "The date with timezone at which the resource was created."
 *    type: string
 *    format: date-time
 *  updated_at:
 *    description: "The date with timezone at which the resource was last updated."
 *    type: string
 *    format: date-time
 *  deleted_at:
 *    description: "The date with timezone at which the resource was deleted."
 *    type: string
 *    format: date-time
 */