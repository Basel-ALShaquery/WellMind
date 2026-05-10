import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getBookings, createBooking } from "@/lib/api";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Calendar, Star, Clock, Globe, Loader2, CheckCircle } from "lucide-react";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface Doctor {
  id: number;
  name: string;
  title: string;
  specialty: string;
  rating: number;
  reviews: number;
  languages: string[];
  sessionTypes: string[];
  bio: string;
  availability: string;
  price: string;
  image: string;
}

const TIME_SLOTS = [
  "9:00 AM", "10:00 AM", "11:00 AM",
  "2:00 PM", "3:00 PM", "4:00 PM", "5:00 PM",
];

const PSYCHOTHERAPISTS: Doctor[] = [
  {
    id: 7, name: "Fatma Ali Abdelbaset", title: "MSc, Psychotherapist", specialty: "Psychotherapy",
    rating: 5.0, reviews: 412, languages: ["Arabic", "English"],
    sessionTypes: ["Video", "Chat"],
    bio: "Highly acclaimed psychotherapist specializing in integrative therapy approaches, helping youth across MENA navigate identity, emotional regulation, and life transitions with profound compassion.",
    availability: "Mon–Fri, 9 AM – 7 PM", price: "$75 / session", image: "👩‍⚕️",
  },
];

const PSYCHIATRISTS: Doctor[] = [
  {
    id: 1, name: "Dr. Fatima Al-Rashidi", title: "MD, Psychiatrist", specialty: "Anxiety & Depression",
    rating: 4.9, reviews: 234, languages: ["Arabic", "English"],
    sessionTypes: ["Video", "Chat"],
    bio: "Board-certified psychiatrist with 12+ years specializing in youth anxiety, depression, and mood disorders across the MENA region.",
    availability: "Mon–Thu, 9 AM – 6 PM", price: "$80 / session", image: "👩‍⚕️",
  },
  {
    id: 2, name: "Dr. Youssef Mansour", title: "MD, Psychiatrist", specialty: "ADHD & Mood Disorders",
    rating: 4.8, reviews: 189, languages: ["Arabic", "French", "English"],
    sessionTypes: ["Video", "In-Person"],
    bio: "Experienced psychiatrist specializing in ADHD, bipolar disorder, and youth mental health with a culturally sensitive approach.",
    availability: "Tue–Sat, 10 AM – 7 PM", price: "$90 / session", image: "👨‍⚕️",
  },
  {
    id: 3, name: "Dr. Amira Khalil", title: "MD, Psychiatrist", specialty: "Trauma & PTSD",
    rating: 4.9, reviews: 156, languages: ["Arabic", "English"],
    sessionTypes: ["Video", "Chat"],
    bio: "Trauma-focused psychiatrist with expertise in PTSD, complex trauma, and culturally sensitive care for youth in conflict-affected regions.",
    availability: "Mon–Fri, 8 AM – 5 PM", price: "$85 / session", image: "👩‍⚕️",
  },
];

const PSYCHOLOGISTS: Doctor[] = [
  {
    id: 4, name: "Dr. Sara Hassan", title: "PhD, Psychologist", specialty: "CBT & Mindfulness",
    rating: 4.9, reviews: 312, languages: ["Arabic", "English"],
    sessionTypes: ["Video", "Chat"],
    bio: "Licensed psychologist specializing in Cognitive Behavioral Therapy (CBT), mindfulness, and anxiety management for youth.",
    availability: "Mon–Fri, 9 AM – 6 PM", price: "$60 / session", image: "👩‍⚕️",
  },
  {
    id: 5, name: "Dr. Khaled Nour", title: "PsyD, Psychologist", specialty: "Adolescent Psychology",
    rating: 4.8, reviews: 267, languages: ["Arabic", "English", "French"],
    sessionTypes: ["Video", "In-Person"],
    bio: "Child and adolescent psychologist with 10+ years helping youth navigate identity, relationships, academic stress, and life transitions.",
    availability: "Tue–Sat, 10 AM – 7 PM", price: "$65 / session", image: "👨‍⚕️",
  },
  {
    id: 6, name: "Dr. Mona Badr", title: "PhD, Psychologist", specialty: "Family & Relationships",
    rating: 4.7, reviews: 198, languages: ["Arabic", "English"],
    sessionTypes: ["Video", "Chat"],
    bio: "Family systems psychologist helping youth and families improve communication, resolve conflicts, and build healthier relationships.",
    availability: "Mon–Thu, 11 AM – 8 PM", price: "$70 / session", image: "👩‍⚕️",
  },
];

function BookingModal({ doctor, userId, onClose, onSuccess }: { doctor: Doctor; userId: string; onClose: () => void; onSuccess: () => void }) {
  const qc = useQueryClient();
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [sessionType, setSessionType] = useState("");
  const [notes, setNotes] = useState("");

  const { mutateAsync: book, isPending } = useMutation({
    mutationFn: createBooking,
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["bookings", userId] }); },
  });

  const handleBook = async () => {
    if (!date || !time || !sessionType) { toast.error("Please fill all required fields"); return; }
    try {
      await book({
        userId,
        therapistId: doctor.id,
        therapistName: doctor.name,
        sessionDate: date,
        sessionTime: time,
        sessionType,
        notes: notes.trim() || undefined,
      });
      toast.success(`Session booked with ${doctor.name}!`);
      onSuccess();
    } catch {
      toast.error("Failed to book. Please try again.");
    }
  };

  return (
    <DialogContent className="max-w-md glass-card border-0">
      <DialogHeader>
        <DialogTitle className="font-display">Book a Session</DialogTitle>
      </DialogHeader>
      <div className="space-y-4">
        <div className="p-4 rounded-xl bg-muted/30 flex items-center gap-3">
          <span className="text-3xl">{doctor.image}</span>
          <div>
            <div className="font-semibold text-foreground">{doctor.name}</div>
            <div className="text-sm text-muted-foreground">{doctor.specialty}</div>
            <div className="flex items-center gap-1 mt-0.5">
              <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
              <span className="text-xs font-medium">{doctor.rating}</span>
            </div>
          </div>
        </div>

        <div>
          <Label htmlFor="date" className="text-sm">Date <span className="text-destructive">*</span></Label>
          <Input
            id="date"
            type="date"
            value={date}
            onChange={e => setDate(e.target.value)}
            min={new Date().toISOString().split("T")[0]}
            className="mt-1 rounded-xl bg-muted/50 border-border/50"
          />
        </div>

        <div>
          <Label className="text-sm">Preferred Time <span className="text-destructive">*</span></Label>
          <Select value={time} onValueChange={setTime}>
            <SelectTrigger className="mt-1 rounded-xl bg-muted/50 border-border/50">
              <SelectValue placeholder="Select a time slot" />
            </SelectTrigger>
            <SelectContent>
              {TIME_SLOTS.map(slot => (
                <SelectItem key={slot} value={slot}>{slot}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label className="text-sm">Session Type <span className="text-destructive">*</span></Label>
          <Select value={sessionType} onValueChange={setSessionType}>
            <SelectTrigger className="mt-1 rounded-xl bg-muted/50 border-border/50">
              <SelectValue placeholder="Choose type" />
            </SelectTrigger>
            <SelectContent>
              {doctor.sessionTypes.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="notes" className="text-sm">Notes <span className="text-muted-foreground text-xs">(optional)</span></Label>
          <Textarea
            id="notes"
            value={notes}
            onChange={e => setNotes(e.target.value)}
            placeholder="Share anything you'd like your therapist to know before the session..."
            rows={3}
            className="mt-1 rounded-xl bg-muted/50 border-border/50 resize-none text-sm"
          />
        </div>

        <div className="flex gap-3 pt-1">
          <Button variant="outline" onClick={onClose} className="flex-1 rounded-xl">Cancel</Button>
          <Button onClick={handleBook} disabled={isPending} className="flex-1 rounded-xl btn-primary shadow-lg shadow-primary/30">
            {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : "Confirm Booking"}
          </Button>
        </div>
      </div>
    </DialogContent>
  );
}

function DoctorCard({ doctor, userId, onBook }: { doctor: Doctor; userId: string; onBook: (d: Doctor) => void }) {
  const isTopRated = doctor.rating === 5.0;
  return (
    <Card className={`glass-card border-0 hover-lift overflow-hidden ${isTopRated ? "ring-2 ring-amber-400/40" : ""}`}>
      <CardContent className="p-6">
        {isTopRated && (
          <div className="flex items-center gap-1.5 mb-3 text-amber-600 bg-amber-50 px-3 py-1.5 rounded-full w-fit text-xs font-semibold">
            <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
            Top Rated
          </div>
        )}
        <div className="flex items-start gap-4">
          <div className="text-4xl">{doctor.image}</div>
          <div className="flex-1 min-w-0">
            <h3 className="font-display font-semibold text-foreground">{doctor.name}</h3>
            <p className="text-sm text-muted-foreground">{doctor.title}</p>
            <div className="flex items-center gap-1.5 mt-1">
              <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
              <span className="text-sm font-medium">{doctor.rating}</span>
              <span className="text-xs text-muted-foreground">({doctor.reviews} reviews)</span>
            </div>
          </div>
          <Badge className="bg-primary/10 text-primary border-0 text-xs">{doctor.specialty}</Badge>
        </div>
        <p className="text-sm text-muted-foreground mt-4 leading-relaxed">{doctor.bio}</p>
        <div className="mt-4 grid grid-cols-2 gap-3 text-xs text-muted-foreground">
          <div className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" /><span>{doctor.availability}</span></div>
          <div className="flex items-center gap-1.5"><Globe className="w-3.5 h-3.5" /><span>{doctor.languages.join(", ")}</span></div>
        </div>
        <div className="mt-4 flex items-center justify-between">
          <span className="font-semibold text-primary">{doctor.price}</span>
          <Button onClick={() => onBook(doctor)} size="sm" className="rounded-xl btn-primary shadow-md shadow-primary/25">Book Session</Button>
        </div>
      </CardContent>
    </Card>
  );
}

export default function SessionsPage({ userId }: { userId: string }) {
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const { data: bookings, isLoading } = useQuery({ queryKey: ["bookings", userId], queryFn: () => getBookings(userId) });

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="text-3xl font-display font-bold text-foreground">Book a Session</h1>
        <p className="text-muted-foreground mt-1">Connect with licensed mental health professionals across the MENA region</p>
      </div>

      <div>
        <div className="flex items-center gap-3 mb-4">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-pink-500 to-rose-400 flex items-center justify-center">
            <span className="text-white text-sm">🌟</span>
          </div>
          <div>
            <h2 className="font-display font-semibold text-lg text-foreground">Psychotherapists</h2>
            <p className="text-xs text-muted-foreground">Specialists in integrative therapy and emotional wellbeing</p>
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {PSYCHOTHERAPISTS.map(d => <DoctorCard key={d.id} doctor={d} userId={userId} onBook={setSelectedDoctor} />)}
        </div>
      </div>

      <div>
        <div className="flex items-center gap-3 mb-4">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-violet-600 to-purple-500 flex items-center justify-center">
            <span className="text-white text-sm">🧠</span>
          </div>
          <div>
            <h2 className="font-display font-semibold text-lg text-foreground">Psychiatrists</h2>
            <p className="text-xs text-muted-foreground">Medical doctors who can diagnose and prescribe medication</p>
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {PSYCHIATRISTS.map(d => <DoctorCard key={d.id} doctor={d} userId={userId} onBook={setSelectedDoctor} />)}
        </div>
      </div>

      <div>
        <div className="flex items-center gap-3 mb-4">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center">
            <span className="text-white text-sm">💬</span>
          </div>
          <div>
            <h2 className="font-display font-semibold text-lg text-foreground">Psychologists</h2>
            <p className="text-xs text-muted-foreground">Specialists in therapy, counseling, and psychological assessment</p>
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {PSYCHOLOGISTS.map(d => <DoctorCard key={d.id} doctor={d} userId={userId} onBook={setSelectedDoctor} />)}
        </div>
      </div>

      {!isLoading && bookings && bookings.length > 0 && (
        <div>
          <h2 className="font-display font-semibold text-xl text-foreground mb-4">Your Bookings</h2>
          <div className="space-y-3">
            {bookings.map((b: { id: number; therapistName: string; sessionDate: string; sessionTime: string; sessionType: string; notes?: string }) => (
              <Card key={b.id} className="glass-card border-0">
                <CardContent className="p-5 flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-400 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <CheckCircle className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-foreground">{b.therapistName}</div>
                    <div className="text-sm text-muted-foreground">{b.sessionDate} at {b.sessionTime} · {b.sessionType}</div>
                    {b.notes && <div className="text-xs text-muted-foreground mt-1 italic">"{b.notes}"</div>}
                  </div>
                  <Badge className="bg-emerald-500/10 text-emerald-600 border-0 flex-shrink-0">Confirmed</Badge>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      <Dialog open={!!selectedDoctor} onOpenChange={open => !open && setSelectedDoctor(null)}>
        {selectedDoctor && (
          <BookingModal doctor={selectedDoctor} userId={userId} onClose={() => setSelectedDoctor(null)} onSuccess={() => setSelectedDoctor(null)} />
        )}
      </Dialog>
    </div>
  );
}
